var overview  = {
    init: function() {
        var $this = this;
        $.ajax({
            url: "/get_decomm_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.decomm_count(data["months"], data["zebra"], data["lbsync"], data["epaas"]);
        });

        $.ajax({
            url: "/get_lb_operation_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.lboperation_count(data["months"], data["enable_disable"], data["create_delete"], data["add_nodes"]);
        });

        $.ajax({
            url: "/get_jira_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.jira_count(data["months"], data["auto"], data["manual"]);
        });

        $.ajax({
            url: "/get_trace_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.cr_count(data["months"], data["auto"], data["manual"]);
        });

        $.ajax({
            url: "/get_downgrade_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.downgrade_count(data["months"], data["downgrade_counts"]);
        });

        $.ajax({
            url: "/get_upgrade_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.upgrade_count(data["months"], data["upgrade_counts"]);
        });

        $.ajax({
            url: "/get_standalone_monthly_count/",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        .success(function(resp) {
            var data = resp["result"];
            $this.standalone_count(data["months"], data["cloudmgr_counts"], data["nwmon_counts"]);
        });
    },
    decomm_count: function(months, zebra_counts, lbsync_counts, epaas_counts) {
      var myChart = Highcharts.chart('monthly-decomm-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Decommed Application by EasyRTB',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                },
                pointWidth: 30,
                pointPadding: 0.1
            }
        },
        series: [{
            name: 'Zebra',
            data: zebra_counts,
            color: '#4dde50'
        }, {
            name: 'LBSync',
            data: lbsync_counts,
            color: '#a1e2fa'
        }, {
            name: 'ePaaS',
            data: epaas_counts,
            color: '#0f37ff'
        }]
      });
    },
    lboperation_count: function(months, add_nodes, create_delete, enable_disable) {
      var myChart = Highcharts.chart('monthly-lboperation-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly LB Operations by EasyRTB',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                },
                pointWidth: 30,
                pointPadding: 0.1
            }
        },
        series: [{
            name: 'Add/Remove Nodes',
            data: add_nodes,
            color: '#4dde50'
        }, {
            name: 'Create/Delete Vips',
            data: create_delete,
            color: '#a1e2fa'
        }, {
            name: 'Enable/Disable Vips',
            data: enable_disable,
            color: '#0f37ff'
        }]
      });
    },
    cr_count: function(months, auto_counts, manual_counts) {
      var myChart = Highcharts.chart('monthly-cr-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Decomm Task',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 30,
                pointPadding: 0.1,
                borderWidth: 0,
                groupPadding: 0.1
            }
        },
        series: [{
            name: 'Manual',
            data: manual_counts,
            color: '#a1e2fa'
        }, {
            name: 'Automated',
            data: auto_counts,
            color: '#4dde50'
        }]
      });
    },
    jira_count: function(months, auto_counts, manual_counts) {
      var myChart = Highcharts.chart('monthly-jira-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Decomm Jira',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
		legend: {
			align: 'right',
			x: -30,
			verticalAlign: 'top',
			y: 25,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 30,
                pointPadding: 0.1,
                borderWidth: 0,
                groupPadding: 0.1
            }
        },
        series: [{
            name: 'Manual',
            data: manual_counts,
            color: '#a1e2fa'
        }, {
            name: 'Automated',
            data: auto_counts,
            color: '#4dde50'
        }]
      });
    },
    downgrade_count: function(months, downgrade_counts) {
      var myChart = Highcharts.chart('monthly-downgrade-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Downgrade Task',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 30,
                pointPadding: 0.1,
                borderWidth: 0,
                groupPadding: 0.1
            }
        },
        series: [{
            name: 'Downgraded',
            data: downgrade_counts,
            color: '#4dde50'
        }]
      });
    },
    upgrade_count: function(months, upgrade_counts) {
      var myChart = Highcharts.chart('monthly-upgrade-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Upgrade Task',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 30,
                pointPadding: 0.1,
                borderWidth: 0,
                groupPadding: 0.1
            }
        },
        series: [{
            name: 'Upgraded',
            data: upgrade_counts,
            color: '#4dde50'
        }]
      });
    },
    standalone_count: function(months, cloudmgr_counts, nwmon_counts) {
      var myChart = Highcharts.chart('monthly-standalone-count', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Standalone Task',
            align: 'left'
        },
        xAxis: {
            categories: months
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 30,
                pointPadding: 0.1,
                borderWidth: 0,
                groupPadding: 0.1
            }
        },
        series: [{
            name: 'Nwmon',
            data: nwmon_counts,
            color: '#a1e2fa'
        }, {
            name: 'CloudMgr',
            data: cloudmgr_counts,
            color: '#4dde50'
        }]
      });
    }
};
