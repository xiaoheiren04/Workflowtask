var task_details = {
    unique: function(array) {
        var last_name = null;
        var result = [];
        for(var i=0; i<array.length; i++) {
          var curr_name = array[i].name;
          if(curr_name != last_name) {
              result.push(array[i]);
          }
          last_name = array[i].name;
        }
        return result;
    },
    showLine: function(seq) {
        $("div.flw-line").hide();
        var space_above = seq * 80 + "px";
        $("div.flw-line").css("margin-top", space_above);
        $("div.flw-line").fadeIn(500);
    },
    showDetails: function(seq) {
        $("div.flw-detail").hide();
        var flow_data = this.flow_data;
        var flow_done = flow_data.flow_done;
        var flow_todo = flow_data.flow_todo;
        var history = flow_done[seq];

        var flowbox_num = flow_done.length + flow_todo.length;
        var detail_height = flowbox_num*60 + (flowbox_num-1)*20 + 'px';

        var html_details = '';
        if(history.has_err) {
            html_details += '<p><strong>Error</strong>: ' + history.err_msg + '</p>';
        }
        else {
            html_details += '<p><strong>Message</strong>: ' + history.message + '</p>';
        }

        html_details += '<p><strong>Submittor</strong>: ' + history.user + '</p>';
//        if(history.changes.length > 0) {
//            html_details += '<p><strong>CR Submitted</strong>: ';
//            for(var i=0; i<history.changes.length; i++) {
//                html_details += history.changes[i].cr_num + " (";
//                html_details += history.changes[i].cr_state + ")";
//            }
//            html_details += '</p>';
//        }
//        else {
//            html_details += '<p><strong>CR Submitted</strong>: None</p>';
//        }

//        if(history.jiras.length > 0) {
//            html_details += '<p><strong>JIRA Submitted</strong>: '
//            for(var i=0; i<history.jiras.length; i++) {
//                var jira = history.jiras[i];
//                html_details += jira.jira_num + " (";
//                html_details += jira.jira_state + ")";
//            }
//            html_details += '</p>';
//        }
//        else {
//            html_details += '<p><strong>JIRA Submitted</strong>: None</p>';
//        }

//        if(history.jobs.length > 0) {
//            html_details += '<p><strong>Jobs Submitted</strong></p>';
//            for(var i=0; i<history.jobs.length; i++) {
//                var job = history.jobs[i];
//                if(job.job_state == "success") {
//                    html_details += '<p><span class="label label-success">' + job.job_state + '</span> ' + '<a target="_blank" href="' + job.job_url + '">' +  job.job_url + '</a></p>';
//                }
//                else if(job.job_state == "failed") {
//                    html_details += '<p><span class="label label-danger">' + job.job_state + '</span> ' + '<a target="_blank" href="' + job.job_url + '">' + job.job_url + '</a></p>';
//                }
//                else {
//                    html_details += '<p><span class="label label-info">' + job.job_state + '</span> ' + '<a target="_blank" href="' + job.job_url + '">' + job.job_url + '</a></p>';
//                }
//            }
//        }
//        else {
//            html_details += '<p><strong>Jobs Submitted</strong>: None</p>';
//        }
        html_details += '</div>';
        $("div.flw-detail").html(html_details);
        $("div.flw-detail").css("height", detail_height);
        $("div.flw-detail").fadeIn(500);
    },
    showLineDetails: function(seq) {
        this.showLine(seq);
        this.showDetails(seq);
    },
    init: function(flow_data) {
        this.flow_data = flow_data;
        var flow_done = flow_data.flow_done;
        var flow_todo = flow_data.flow_todo;
        var has_err = flow_data.has_err;
        var state = flow_data.state;
        var html_flow_done = "";
        var html_flow_todo = "";
        for(var i=0; i<flow_done.length; i++) {
            var history = flow_done[i];
            if(i < flow_done.length-1) {
                html_flow_done += '<div class="flw-box flw-success" onclick="task_details.showLineDetails(' + i + ')"><div class="flw-timebox">' + history.timestamp + '</div><div class="flw-textbox">' + history.state_uiname + '</div></div>';
                html_flow_done += '<div class="flw-vlne"></div>';
            }
            else {
                if(has_err) {
                    html_flow_done += '<div class="flw-box flw-failed" onclick="task_details.showLineDetails(' + i + ')"><div class="flw-timebox">' + history.timestamp + '</div><div class="flw-textbox">' + history.state_uiname + '</div></div>';
                }
                else if(history.state_name == "CANCELLED") {
                    html_flow_done += '<div class="flw-box flw-cancelled" onclick="task_details.showLineDetails(' + i + ')"><div class="flw-timebox">' + history.timestamp + '</div><div class="flw-textbox">' + history.state_uiname + '</div></div>';
                }
                else {
                    html_flow_done += '<div class="flw-box flw-pending" onclick="task_details.showLineDetails(' + i + ')"><div class="flw-timebox">' + history.timestamp + '</div><div class="flw-textbox">' + history.state_uiname + '</div></div>';
                }
            }
        }
        for(var i=0; i<flow_todo.length; i++) {
            var history = flow_todo[i];
            html_flow_todo += '<div class="flw-vlne"></div>';
            html_flow_todo += '<div class="flw-box flw-todo">' + history.uiname + '</div>';
        }
        var html_chart = '<div class="flw-chart">' + html_flow_done + html_flow_todo + '</div>';
        var html_line = '<div class="flw-line"></div>';
        var html_details = '<div class="flw-detail"></div>';
        $(".flw").html(html_chart + html_line + html_details);
        this.showLineDetails(flow_done.length-1);
    }
};
