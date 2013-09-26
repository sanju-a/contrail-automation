var imageRoot = 'images/';
var baseURL = location.protocol + '//' + location.host + '/';

var $ = jQuery.noConflict();

jQuery(document).ready(function($) {	
	$("#lostpassword-dialog").on("click", ".submitbtn", function(event){
		if( $('#reset_email').val() != $('#reset_email1').val() ) {
			$('#lostpassword_error_msg').html("Your email addresses don't match!");
			$('#lostpassword_error').show();
			return;
		}
		$("#resetpassword_btn").button('loading');
		$.getJSON(baseURL + 'php/get_customer_details.php?type=reset_password&email=' + $('#reset_email').val(), function(results){
			$("#resetpassword_btn").button('reset');
			if( results.message) {
				$('#lostpassword_error_msg').html(results.message);
				$('#lostpassword_error').show();
			}
		});		
	});
		
	$("#email_login").click(function() {
	    if( $('#login_email').val().length == 0 ) {
            $('#login_error_msg').html("Please enter your email address");
		    $('#login_error').show();
            return;
	    }
	    if( $('#login_password').val().length == 0 ) {
            $('#login_error_msg').html("Please enter your password");
		    $('#login_error').show();
            return;
	    }
	
	    $("#email_login").button('loading');
		$('#login_error').hide();
	    $.ajax({
            url: baseURL + 'php/emaillogin.php',
            data: 'email=' + $('#login_email').val() + '&password=' + $('#login_password').val(),
            dataType: 'json',
            type: 'post',
            success: function(result) {
				$('#login_spinner').hide();
				if( result.error_msg != null ) {
				    $('#login_error_msg').html(result.error_msg);
				    $('#login_error').show();
					$("#email_login").button('reset');
				} else {
	                if( result.redirect != null ) {
                        window.location = result.redirect;
	                } else {
							$("#email_login").button('reset');
	                }
				}
            },
	    error: function(result) {
            $('#login_error_msg').html("Sorry - something went wrong there. Please try again.");
            	$("#email_login").button('reset');
            }
	    });
	});

	$( "#register-dialog" ).on('click', '.submitbtn', function() {
		var update_string = "email=" + $('#register_email').val() + '&name=' + $('#register_name').val() + '&contact=' + $('#contact_number').val();
		var other_string = $("#register-form").serialize();
		
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if( $('#name').val().length == 0 ) {
			$('#registration_error_msg').html('Please enter your name');
			$('#registration_error').show();
			return;
		}
		
		if( $('#register_email').val() != $('#register_email1').val() ) {
			$('#registration_error_msg').html("Your email addresses don't match!");
			$('#registration_error').show();
			return;
		}

		if( !$('#register_email').val().match(re) ) {
			$('#registration_error_msg').html('Please enter a valid email address');
			$('#registration_error').show();
			return;
		}
		
		$('#registration_error').hide();

		$('#register-dialog').find('.submittbn').button('loading');
		$.ajax({
				url: baseURL + 'php/do_validation.php?'+ $("#register-form").serialize(), 
				dataType: 'json',
				success: function(data) {
					$('#register-dialog').find('.submittbn').button('reset');
					if( data.message != null ) {
						$('#general-info-content').html(data.message);
						$('#general-info').modal("show");
					}
				},
				error: function(data) {
					$('#register-dialog').find('.submittbn').button('reset');
					alert('Sorry - something went wrong. Please try again later.');
				}
		});	
	});	

	$("#changeplan-dialog").on("show", function(event){
			$('#changeplan_error').hide();
			$.ajax({
  				url: baseURL + 'php/get_select_json.php?table=tbl_planfeatures&upgrade_only',
  				dataType: 'json',
  				success: function(result) {
					$("select#plans").html(createSelectHTML(result));
    				}
				});
		});

	$( "#password-dialog" ).on('click', '.submitbtn', function(){
		if( $('#register_password').val().length < 6 ) {
			$('#password_error_msg').html('Your password must be 6 characters or longer');
			$('#password_error').show();
			return;
		}
	
		if( $('#register_password').val() != $('#register_password_repeat').val() ) {
			$('#password_error_msg').html('Your password fields should match');
			$('#password_error').show();
			return;
		}
		$('#password_error').hide();
		$.ajax({
			url: baseURL + 'php/get_customer_details.php?type=set_password&password=' + $('#register_password').val(),
			dataType: 'jsonp',
			success: function(data) {
				$( "#password-dialog" ).modal("hide"); 
				if( data.message != 'OK' ) {
					$('#password_error_msg').html(data.message);
					$('#password_error').show();
				} else {
					$( "#password-dialog" ).modal('hide');
				}
			},
			error: function(data) {
				$('#password_error_msg').html("Something went wrong. Please try again.");
				$('#password_error').show();
			}
		});		
	});
});

function facebookLogin()
{
	window.location = 'fblogin.php';
}

function checkCustomTime() {
	if( $("#modifyTime").val() == 999 ) {
		$("#customTime").show();
		$('#timeSlider').slider( 
			{ 	min: 1,
				max: 180, 
				value: 5,
			})
		.on('slide', function(ev) { 	
			$("#customTimeSliderUI").text( ev.value );
			$("#customTimeSlider").val( ev.value );				
		});
	} else {
		$("#customTime").hide();
	}
}

function showControllers() {
		$('#controller-dialog').modal("show");
}


function redirect(destination) 
{
	window.location = destination;
}

