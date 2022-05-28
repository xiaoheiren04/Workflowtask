import re
import math
import logging
import importlib
import os
import os.path
import xml.etree.ElementTree as ET
from workflow.models import Workflow, WorkflowHistory

logger = logging.getLogger(__name__)
class NoSuchWorkflowType(Exception):
    pass
class InvalidState(Exception):
    pass
class InvalidAction(Exception):
    pass
class CannotExecuteAction(Exception):
    pass
class MultipleAvailActions(Exception):
    pass
class MultipleProceedTargets(Exception):
    pass

class Action:
    def __init__(self, name, group=None, condition=None, target=None):
        self.name = name
        self.group = group
        self.condition = condition
        self.target = target

    def __repr__(self):
        return "<Action name=(%s) group=(%s) target=(%s)>" % (
            self.name, self.group, self.target)

class State:
    def __init__(self, name, need_confirm, sla):
        self.name = name
        self.need_confirm = need_confirm
        self.sla = sla
        self.actions = []

    def add_action(self, action):
        self.actions.append(action)

    def __repr__(self):
        actions_repr = map(lambda x: repr(x), self.actions)
        return "<State name=(%s) need_confirm=(%d) sla=(%f) actions=(%s)>" % (
            self.name, self.need_confirm, self.sla, ", ".join(actions_repr))

class FsmDefinition(object):
    @staticmethod
    def get_name_uiname_mapping(filename):
        tree = ET.parse(filename)
        root = tree.getroot()
        state_nodes = root.findall(".//state")
        mapping = {}
        for node in state_nodes:
            name = node.get("name")
            ui_name = node.get("ui_name")
            mapping[name] = ui_name

        return mapping

    @staticmethod
    def get_fsm_definition(filepath):
        tree = ET.parse(filepath)
        root = tree.getroot()
        type_node = root.find("type")
        tz_node = root.find("time_zone")
        desc_node = root.find("description")
        actionmod_node = root.find("actionmod")
        conditionmod_node = root.find("conditionmod")
        state_nodes = root.findall(".//state")
        observer_nodes = root.findall(".//observer")

        meta = {}
        meta["type"] = type_node.text
        meta["tz"] = tz_node.text
        meta["desc"] = desc_node.text
        meta["actionmod"] = importlib.import_module(actionmod_node.text)
        meta["conditionmod"] = importlib.import_module(conditionmod_node.text)
        meta["observermods"] = list(map(lambda x: importlib.import_module(x.text), observer_nodes))
        meta["states"] = []
        for node in state_nodes:
            name = node.get("name")
            need_confirm = bool(int(node.get("need_confirm")))
            sla = float(node.get("sla")) if node.get("sla") is not None else math.inf
            state = State(name, need_confirm, sla)

            action_nodes = node.findall(".//action")
            for action_node in action_nodes:
                name = action_node.get("name")
                group = action_node.get("group")
                target = action_node.get("target")
                cond = action_node.get("condition")
                action = Action(name, group, cond, target)
                state.add_action(action)
            meta["states"].append(state)
        return meta

    @staticmethod
    def get_fsm_definition_by_type(fsm_type):
        def_dir = os.path.join(os.path.dirname(__file__), "definitions")
        fsm_defs = os.listdir(def_dir)
        fsm_metas = {}
        for fsm_def in fsm_defs:
            filepath = os.path.join(def_dir, fsm_def)
            if not re.search(r'\.xml$', filepath):
                continue
            meta = FsmDefinition.get_fsm_definition(filepath)
            if meta["type"] == fsm_type:
                return meta
        raise NoSuchWorkflowType(fsm_type)

    @staticmethod
    def get_name_uiname_mapping_by_type(fsm_type):
        def_dir = os.path.join(os.path.dirname(__file__), "definitions")
        fsm_defs = os.listdir(def_dir)
        fsm_metas = {}
        for fsm_def in fsm_defs:
            filepath = os.path.join(def_dir, fsm_def)
            if not re.search(r'\.xml$', filepath):
                continue
            meta = FsmDefinition.get_fsm_definition(filepath)
            mapping = FsmDefinition.get_name_uiname_mapping(filepath)
            if meta["type"] == fsm_type:
                return mapping
        raise NoSuchWorkflowType(fsm_type)

    def __init__(self, fsm_type):
        fsm_meta = FsmDefinition.get_fsm_definition_by_type(fsm_type)
        self.meta = fsm_meta
        self.mapping = FsmDefinition.get_name_uiname_mapping_by_type(fsm_type)
        self.fsm_type = fsm_type

    def get_all_states(self):
        return self.meta["states"]

    def get_condition_mod(self):
        return self.meta["conoditionmod"]

    def get_action_mod(self):
        return self.meta["actionmod"]

    def get_observer_mods(self):
        return self.meta["observermods"]

    def get_state(self, state_name):
        matched = list(filter(lambda x: x.name == state_name, self.meta["states"]))
        if len(matched) == 0:
            raise InvalidState(state_name)
        return matched[0]

    def get_state_ui_name(self, state_name):
        return self.mapping.setdefault(state_name, "")

    def get_state_sla(self, state_name):
        state = self.get_state(state_name)
        return state.sla

    def get_flow_data(self):
        states = self.meta["states"]
        data = []
        for state in states:
            name = state.name
            uiname = self.get_state_ui_name(name)
            targets  = list(map(lambda x: {"action": x.name, "target": x.target ,"group": x.group}, state.actions))
            data.append({
                "name": name,
                "uiname": uiname,
                "targets": targets,
            })
        return data

    # only show proceed data, do not show rollback data
    def get_flow_data_from(self, start="INITIAL"):
        whole_flow = self.get_flow_data()
        queue = []
        matched_states = list(filter(lambda x: x["name"] == start, whole_flow))
        if len(matched_states) == 0:
            raise InvalidState(start)

        start_state = matched_states[0]
        queue.append(start_state)
        result = []
        while len(queue) > 0:
            state = queue.pop(0)
            result.append(state)
            proceed_targets = list(filter(lambda x: x["group"] == "proceed", state["targets"]))
            targets = list(map(lambda x: x["target"], proceed_targets))
            if len(targets) > 1:
                raise MultipleProceedTargets(targets)
            if len(targets) == 0:
                break

            target = targets[0]
            matched_states = list(filter(lambda x: x["name"] == target, whole_flow))
            if len(matched_states) == 0:
                raise InvalidState(target)
            queue.append(matched_states[0])
        return result[1:]

class FSM(object):
    def __init__(self, fsm_def, current_state_name="INITIAL"):
        self.fsm_def = fsm_def
        self.has_err = False
        self.err_msg = None
        self.current_state = self.fsm_def.get_state(current_state_name)

    # return state name
    def get_current_state(self):
        state = self.current_state
        name = state.name
        need_confirm = state.need_confirm
        ui_name = self.fsm_def.get_state_ui_name(name)
        return {"name": name, "ui_name": ui_name, "need_confirm": need_confirm}

    # return list of action names
    def get_current_actions(self, group=None, context={}):
        avail_actions = self.__get_current_actions(group, context)
        current_actions = list(map(lambda x: {
            "name": x.name,
            "ui_name": x.name.replace("_", " ").title()},
            avail_actions))
        return current_actions

    def __get_current_actions(self, group=None, context={}):
        states = list(filter(lambda x: x.name == self.current_state.name,
            self.fsm_def.get_all_states()))
        if len(states) == 0:
            raise InvalidState("%s is not a valid state"
                % self.current_state.name)
        actions = states[0].actions
        if group:
            actions = filter(lambda x: x.group == group, actions)

        avail_actions = []
        for action in actions:
            if action.condition is None:
                avail_actions.append(action)
            else:
                condition_mod = self.fsm_def.get_condition_mod()
                if getattr(condition_mod, action.condition)(**context):
                    avail_actions.append(action)
        return avail_actions

    def execute_action(self, action_name, context={}):
        actions = list(filter(lambda x: x.name == action_name,
            self.current_state.actions))

        if len(actions) == 0:
            raise InvalidAction("%s is not a valid action at %s" % (
                action_name, self.current_state.name))

        if actions[0].condition:
            condition_mod = self.fsm_def.get_condition_mod()
            result = getattr(condition_mod, actions[0].condition)(**context)
            if result == False:
                raise CannotExecuteAction(
                    self.current_state.name,
                    action_name)

        current_state_name = self.current_state.name
        next_state_name = actions[0].target
        next_state = self.fsm_def.get_state(next_state_name)
        action_mod = self.fsm_def.get_action_mod()
        getattr(action_mod, actions[0].name)(current_state_name, action_name, next_state_name, **context)
        self.current_state = self.fsm_def.get_state(next_state_name)

        # run observer
        for observer_mod in self.fsm_def.get_observer_mods():
            getattr(observer_mod, "update")(action_name, next_state_name, **context)
        return self.get_current_state()

    def __repr__(self):
        return '<FSM fsm_type="%s" current_state="%s">' % (self.fsm_def.fsm_type, self.current_state.name)



def create_workflow(wf_type):
    workflow = Workflow(state="INITIAL", workflow_type=wf_type)
    workflow.save()
    history = WorkflowHistory(user="system", state="INITIAL", action="init", message="init workflow", workflow=workflow)
    history.save()
    return workflow.id

def reset_err(workflow_id):
    workflow = Workflow.objects.get(pk=workflow_id)
    workflow.has_err = False
    workflow.err_msg = ""
    workflow.save()