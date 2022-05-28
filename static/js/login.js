function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var login = {
    onkeydownLogin: function(event) {
        if(event.keyCode == 13) {
            $("#sb-btn").click();
        }
    },
    validate: function(event) {
        $("#lg-err").hide();
        // if username is empty
        if($("#ip-un").val() == "") {
            // if no alert
            if($("#alert-un").length == 0) {
                $('<span class="text-danger" id="alert-un">Enter your username</span>').insertAfter("#ip-un");
            }
            $("#ip-pw").val("");
            $("#alert-pw").remove();
            return;
        }
        else {
            $("#alert-un").remove();
        }

        if($("#ip-pw").val() == "") {
            if($("#alert-pw").length == 0) {
                $('<p class="text-danger" id="alert-pw">Enter your token</p>').insertAfter("#ip-pw");
            }
            return;
        }
        else {
            $("#alert-pw").remove();
        }

        var user = $("#ip-un").val().trim();
        var token = $("#ip-pw").val().trim();
        $.ajax({
            url: "/api/login/",
            method: "POST",
            data: {
                user: user,
                tokencode: token,
            }
        })
        .success(function(data) {
            if(!data.success) {
                $("#lg-err").html('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' + data.msg);
                $("#lg-err").show();
            }
            else {
                var url = window.location.href;
                var re = /\?next=(\S*)/;
                matched = url.match(re);
                if(matched) {
                    to_url = matched[matched.length-1];
                    window.location.href = to_url;
                }
                else {
                    window.location.href = "/update_version/";
                }
            }
        });
    }
};

