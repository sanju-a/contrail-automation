var $ = jQuery.noConflict();

jQuery(function($) {		
	$(".tt").tooltip();	
	try {
		$.fn.dataTableExt.oApi.fnReloadAjax = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
		{
		    if ( typeof sNewSource != 'undefined' && sNewSource != null )
		    {
		        oSettings.sAjaxSource = sNewSource;
		    }
		    this.oApi._fnProcessingDisplay( oSettings, true );
		    var that = this;
		    var iStart = oSettings._iDisplayStart;
		     
		    oSettings.fnServerData( oSettings.sAjaxSource, [], function(json) {
		        /* Clear the old information from the table */
		        that.oApi._fnClearTable( oSettings );
		         
		        /* Got the data - add it to the table */
		        var aData =  (oSettings.sAjaxDataProp !== "") ?
		            that.oApi._fnGetObjectDataFn( oSettings.sAjaxDataProp )( json ) : json;
		         
		        for ( var i=0 ; i<aData.length ; i++ )
		        {
		            that.oApi._fnAddData( oSettings, aData[i] );
		        }
		         
		        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		        that.fnDraw();
		         
		        if ( typeof bStandingRedraw != 'undefined' && bStandingRedraw === true )
		        {
		            oSettings._iDisplayStart = iStart;
		            that.fnDraw( false );
		        }
		         
		        that.oApi._fnProcessingDisplay( oSettings, false );
		         
		        /* Callback user function - for event handlers etc */
		        if ( typeof fnCallback == 'function' && fnCallback != null )
		        {
		            fnCallback( oSettings );
		        }
		    }, oSettings );
		}
	} catch(error) {};
});

function sendTestSMS()
{
	if( $('#sms').length ) {
	
		var dataString = 'mobile_test=' + $('#sms').val();
		$('#sms_test').button( 'loading' );
	 	$.ajax(
	  	{
			type: "POST",
			url: baseURL + "php/process_request.php",
			data: dataString,
			dataType: 'json',
			error: function()
			{
				$('#sms_test').button( "reset" );
		  		$( "#general-error" ).modal("show");
			},
			success: function(response) {
				$('#sms_test').button( "reset" );
				if( response.error_msg ) {
					alert( response.error_msg );
				} else {
					alert( "Message sent" );
				}
			}
	   	});
	} else {
		alert("Please enter a number");
	}
}

function buyNow()
{
	window.open(baseURL + 'hydrawise.com/buy-now');
}

function deleteRow(response, table, tableRow)
{
	if( response == null ) {
		$( "#general-error" ).modal("show");
		$(tableRow).find('.delete').attr("src", 'images/del.gif');
	} else {
		if( response.error_msg != null ) {
			$( '#delete-error p').html(response.error_msg);
			$( "#delete-error" ).modal("show");
			$(tableRow).find('.delete').attr("src", 'images/del.gif');
		} else {
			$(table).dataTable().fnDeleteRow( tableRow );
			if( response.refresh ) {
				for(var index in response.refresh) {
  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
				}
			}
		}
	}
}

var groupingOptions = {iGroupingColumnIndex: 1, sGroupingColumnSortDirection: 'asc', sGroupingClass: 'groupHeader'};

function jeditable_bind(element)
{
	$('#' + element + ' td.jedit_time').editable( baseURL + "php/process_tablerequest.php", 
	{ 
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : submitDataTable,
		type      : 'time',
  		tooltip	  : 'Click to edit...',
  		submit    : 'OK',
  		cancel    : 'Cancel',
  		style	  : 'inherit',
  		onblur    : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});

	$('#' + element + ' td.jedit_select').editable( baseURL + "php/process_tablerequest.php", 
	{ 
  		loadurl  : baseURL + 'php/get_select.php',
  		loaddata : loadDataTable,
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : submitDataTable,
  		type	 : 'select',
  		tooltip	 : 'Click to edit...',
  		submit   : 'OK',
  		cancel   : 'Cancel',
  		style	 : 'inherit',
  		onblur 	 : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});
	
	$('#' + element + ' td.jedit_text').editable( baseURL + "php/process_tablerequest.php", 
		{ 
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : submitDataTable,
		type      : 'text',
  		tooltip	  : 'Click to edit...',
  		submit    : 'OK',
  		cancel    : 'Cancel',
  		style	  : 'inherit',
  		onblur    : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});
	
	$('#' + element + ' td.jedit_time').editable( baseURL + "php/process_tablerequest.php", 
	{ 
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : submitDataTable,
		type      : 'time',
  		tooltip	  : 'Click to edit...',
  		submit    : 'OK',
  		cancel    : 'Cancel',
  		style	  : 'inherit',
  		onblur    : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});

	$('#' + element).off('click', '.delete');
	$('#' + element).on('click', '.delete', function() {
		if( confirm('This action cannot be undone. Are you sure?') ) {
			var id = this.id;
			var tableID = id.split("-");
			var dataString = "table="+tableID[0]+"&id="+tableID[1];
			var table = $(this).closest('table')[0];
			var tableRow = $(this).closest('tr')[0];
			$(this).addClass('icon-spinner icon-spin');
			$.ajax(
			{
				type: "POST",
				url: baseURL + "php/delete_row.php",
				data: dataString,
				dataType: 'json',
				async: true,
				success: function(response) {
					deleteRow(response, table, tableRow );
				},
				error: function() {
					$( "#general-error" ).modal("show");
				}
			});
		}
	});	
}

// zones startup
function zones_startup()
{	
	$( "#assignsensor-dialog" ).on('show', function() {
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=' + $('#sensor-type').val() + '&relay_id=' + $('#sensor-relay_id').val(),
				dataType: 'json',
				success: function(result) {
					$("select#sensor_name").html(createSelectHTML(result));
				}
		});
	});

	$("#assignsensor-dialog").on("click", ".submitbtn", function(event){
		$( "#assignsensor-dialog" ).find(".submitbtn").button('loading');
		$.ajax({
			url: baseURL + 'php/process_tablerequest.php',
			type: "POST",
			data: 'table=' + $('#sensor-type').val() + '&relay_id=' + $('#sensor-relay_id').val() + '&sensor_id=' + $('#sensor_name').val(),
			error: function() {
			$( "#assignsensor-dialog" ).find(".submitbtn").button('reset');
				$("#assignsensor-dialog").modal("hide");
				$( "#general-error" ).modal("show");
			},
			success: function(result) {
				$( "#assignsensor-dialog" ).find(".submitbtn").button('reset');
				$("#assignsensor-dialog").modal("hide");
				$('#relays').dataTable().fnReloadAjax();
			}
		});
	});
	
	$( "#time-dialog" ).on('show', function() {
        var hourselect = $('<select id="hour_time" class="span3" />');
        var minselect  = $('<select id="min_time" class="span3" />');
        
        for (var hour=0; hour <= 23; hour++) {
            if (hour < 10) {
                hour = '0' + hour;
            }
            var option = $('<option />').val(hour).append(hour);
            hourselect.append(option);
        }
        $('#time_select').html(hourselect);

        for (var min=0; min < 60; min = parseInt(min, 10) + 5) {
            if (min < 10) {
                min = '0' + min;
            }
            var option = $('<option />').val(min).append(min);
            minselect.append(option);
        }
        $('#time_select').append(minselect);
	});

	$("#time-dialog").on("click", ".submitbtn", function(event){
		// work out selected days
		var dataString = baseURL + 'php/add_row_json.php?table=tblwatersettings&time=' + $('#hour_time option:selected').val() + ':' +  $('#min_time option:selected').val() + '&type=' + $("#water_type option:selected").val();
		var option = $('#time_type option:selected').val();
		switch( option ) {
			case 'odd':
				dataString += '&odd=1';
				break;
			case 'even':
				dataString += '&even=1';
				break;
			case 'days':
				var images = $(".days a i:visible");
				for(var index=0; index < images.length; index++) {
					dataString += '&' + images[index].id + '=1';
				}
				break;
		}
		
		$( "#time-dialog" ).find(".submitbtn").button('loading');
		$.ajax({
			url: dataString,
			dataType: 'json',
			success: function(response) {
				$("#time-dialog").modal( 'hide' );
				$( "#time-dialog" ).find(".submitbtn").button('reset');
				if( response.refresh ) {
					for(var index in response.refresh) {
	  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
					}
				}
			},
			error: function(response) {
				$( "#time-dialog" ).find(".submitbtn").button('reset');
				alert('That request timed out - please try again.');
			}
		});
	});

	$( "#tbl_relays-dialog" ).on('show', function() {
		$('#relay_error').hide();
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_category',
				dataType: 'json',
				success: function(result) {
				if(result) {
					if( result.error_msg ) {
						alert( result.error_msg );
						$("#tbl_relays-dialog").modal('hide');
						$( "#create-category" ).click();
					} else {
						$("select#cat_id").html(createSelectHTML(result));
					}
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
		});

		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_relaytypes&field=relay_number',
				dataType: 'json',
				success: function(result) {
				if(result) {
	  				$("select#relaytype_id").html(createSelectHTML(result));
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
		});
	});

	$("#tbl_relays-dialog").on("click", ".submitbtn", function(event){
		var loadurl = baseURL + 'php/add_row_json.php?table=tbl_relays&name=' + $("#relay_name").val() + "&cat_id=" + $("#cat_id").val() + "&relaytype_id=" +$("#relaytype_id").val();
		$("#tbl_relays-dialog").find(".submitbtn").button('loading');
		$.ajax({
				url: loadurl,
				dataType: 'json',
				async: false,
				success: function(response) {
						$("#tbl_relays-dialog").find(".submitbtn").button('reset');
						if( response.error_msg != null ) {
							$('#relay_error_msg')[0].innerHTML = response.error_msg;
							$('#relay_error').show();
						} else {
							if( response.refresh ) {
								for(var index in response.refresh) {
				  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
								}
							}
							$('#tbl_relays-dialog').modal( 'hide' );
	  				}
				},
				error: function() {
					$("#tbl_relays-dialog").find(".submitbtn").button('reset');
				}
			});
	});
	
	$( "#categories-dialog" ).on('show', function() {
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_spraytypes&field=type',
				dataType: 'json',
				success: function(result) {
					$("select#spraytype").html(createSelectHTML(result));
				}
			});
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_excesswatertypes&field=excess_type',
				dataType: 'json',
				success: function(result) {
			    	$("select#excess_type_id").html(createSelectHTML(result));
				}
			});
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_runfrequency&field=type',
				dataType: 'json',
				success: function(result) {
			    	$("select#runfrequency").html(createSelectHTML(result));
				}
			});
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_relaytypes&field=relay_number',
				dataType: 'json',
				success: function(result) {
					$("select#relaytype_id").html(createSelectHTML(result));
				}
			});
	});	

    $('.more-details').live( 'click', function () {
        var nTr = $(this).parents('tr')[0];
        $(this).toggleClass('icon-flip-vertical');
 
        if ( $("#relays").dataTable().fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            $("#relays").dataTable().fnClose( nTr );
        }
        else
        {
            /* Open this row */
            var aData = $("#relays").dataTable().fnGetData( nTr ); 
            $("#relays").dataTable().fnOpen( nTr, aData[6], 'details' );
 			$(".override").click(function(event) {
				var action = this.id.split('-');
				cancelManual(action[0], action[1]);
			});
       }
    } );

	$("#categories-dialog").on("click", ".submitbtn", function(event){
		var loadurl = baseURL + 'php/add_row_json.php?table=tbl_category&cat_name=' + $("#cat_name").val() + "&run_time=" +$("#run_time").val() + "&runfrequency=" +$("#runfrequency").val() + "&excess_type_id=" +$("#excess_type_id").val();
		$("#categories-dialog").find(".submitbtn").button('loading');
		$.ajax({
			url: loadurl,
			dataType: 'json',
			async: false,
			success: function(response) {
				$("#categories-dialog").find(".submitbtn").button('reset');
				if( response.error_msg != null ) {
					$('#category_error_msg')[0].innerHTML = response.error_msg;
					$('#category_error').show();
				} else {
					if( response.refresh ) {
						for(var index in response.refresh) {
		  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
						}
					}
					$("#categories-dialog").modal( 'hide' );

					// force an update of the select box on the add zone dialog
					$.ajax({
		  				url: baseURL + 'php/get_select_json.php?table=tbl_category',
		  				dataType: 'json',
		  				success: function(result) {
							if(result) {
								if( result.error_msg ) {
									alert( result.error_msg );
									$("#categories-dialog").modal( 'hide' );
									$( "#create-category" ).click();
								} else {
									$("select#cat_id").html(createSelectHTML(result));
								}
							} else {
								alert('There was an error with the server. Please try again');
							}
		    			}
					});
				}
			},
			error: function() {
				$("#categories-dialog").find(".submitbtn").button('reset');
			}
		});
	});

	// fetch icons
	$.ajax({
			url: baseURL + 'php/get_select_json.php?table=tbl_relayicons&field=icon',
			dataType: 'json',
			success: function(data) {
				if(data) {
					var appendString = "<input type='hidden' id='icon-table' /><input type='hidden' id='table-id' />";
					for (var i = 0; i < data.length; i++) {
						appendString += "<div class='singleIconSummary' data-id='" + data[i].id + "' data-value='" + data[i].value + "'>";
						appendString += "<a href='#'>";
						appendString += "<img id='" + data[i].id + "' src=" + "images/" + data[i].value + " style='border: none;'/>";
						appendString += "</a>";
						appendString += "</div>";	
					}
					$('.iconSummary').html(appendString);		

					$('.singleIconSummary').click( function(event) {
							$.ajax({
				  				url: baseURL + 'php/process_tablerequest.php',
								type: "POST",
								data: 'table=tbl_category&field=icon&value=' + $(this).data('id') + '&id=' + $("#table-id").val(),
								success: function() {
									// update datatable
									$('#tbl_category').dataTable().fnReloadAjax();
									
									// force update of relay table because icons might have changed
									$('#relays').dataTable().fnReloadAjax();
								},
								error: function() {
									$( "#general-error" ).modal("show");
								}
							});
							event.preventDefault();
							$( "#icon-dialog" ).modal( 'hide' );										
					});
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
	});

	$('#tblwatersettings').on('click', '.centre-toggle', function(event) { 
        toggleTable(this);
        return false; 
    }); 

	// class given to all icon columns in a datatable
	$('#tbl_category').on('click', '.iconmodify', function(event) {
		var tableElement = $(this).closest('table')[0];
		var aPos = $('#'+tableElement.id).dataTable().fnGetPosition( this );
		var aData = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0];
		var id = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0]; // tr

		$("#table-id").val(id);		
		$( "#icon-dialog" ).modal( 'show' );	
		return false;
	});

	$('#tbl_category').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "category-id", "bVisible": false },
			{ "mData": 1, "sClass": "iconmodify hidden-phone"},
			{ "mData": 2, "sClass": "jedit_text"},
			{ "mData": 3, "sClass": "jedit_select hidden-phone", "bVisible": false},
			{ "mData": 4, "sClass": "jedit_text"},
			{ "mData": 5, "sClass": "jedit_select"},	
			{ "mData": 6, "sClass": "jedit_select"},
			{ "mData": 7, "sClass": "centre"}
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bAutoWidth": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"sDom": 'lfrti',
		"fnDrawCallback": function( oInstance, json ) {
			jeditable_bind(this[0].id);
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { 
				redirect(json.error_msg); 
			}
		},
 		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "No watering schedules are configured - <a data-toggle='modal' href='#categories-dialog'>Add a Watering Schedule</a>"
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=categories&v1'
	});

	$('#tblwatersettings').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "category-id", "bVisible": false },
			{ "mData": 1, "sClass": "type", "bVisible": false },
			{ "mData": 2, "sClass": "jedit_time"},
			{ "mData": 3, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 4, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 5, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 6, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 7, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 8, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 9, "sWidth": "8%", "sClass": "centre-toggle"},
			{ "mData": 10, "sClass": "centre-toggle border-left",  "bVisible": false },
			{ "mData": 11, "sClass": "centre-toggle",  "bVisible": false },
			{ "mData": 12, "sClass": "chosen_edit"},
			{ "mData": 13, "sClass": "centre"}
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"bAutoWidth": false,
		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "No program start times configured - <a data-toggle='modal' href='#time-dialog'>Add a program start</a> time"
		},
		"sDom": 'lfrti',
		"fnDrawCallback": function( oInstance, json) {
			$("#tblwatersettings .chosen").chosen({placeholder_text: 'All zones and schedules'});
			$("#tblwatersettings .chosen").chosen().change( function() {
				var water_id = this.id.split('-');
				var dataString = 'table=wateringassignments&water_id=' + water_id[1] + '&' + $(this).serialize();
			  	$.ajax({
					type: "POST",
					url: baseURL + "php/process_tablerequest.php",
					dataType: 'json',
					data: dataString,
					success: function(response) {
						if( response.refresh ) {
							for(var index in response.refresh) {
			  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
							}
						}
					},
					error: function() {
						$( "#general-error" ).modal("show");
					}
			   	});
			});
			$(".tt").tooltip();
			jeditable_bind(this[0].id);
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { 
				redirect(json.error_msg); 
			}
		},
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
			if( $(aData[10]).hasClass('enabled') || $(aData[11]).hasClass('enabled') ) {
				var insertText;
				if( $(aData[10]).hasClass('enabled') ) {
					insertText = "even";
				} else {
					insertText = "odd";
				} 
				var cellData = "<td class='jedit_time'>" + aData[2] + "</td><td style='text-align: center' colSpan=7>Watering on " + insertText + " days</td><td>" + aData[12] + "</td><td>" + aData[13] + "</td>";
		 		$(nRow).html(cellData);
	 		}
 			return nRow;		
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=runtimes&v2'
	} ).rowGrouping(groupingOptions);

	$('#relays').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "relays-id", "bVisible": false },
			{ "mData": 1, "sClass": "hidden-phone"},
			{ "mData": 2, "sClass": "jedit_text"},
			{ "mData": 3, "sClass": "jedit_select"},
			{ "mData": 4, "sClass": "jedit_select"},
			{ "mData": 5, "sClass": "hidden-phone schedule_show"},
			{ "mData": 6, "sClass": "relays-schedule", "bVisible": false },
			{ "mData": 7, "sClass": "centre"}
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"bAutoWidth": false,
   		"sDom": 'lfrti',
        "sPaginationType": "bootstrap",
        "fnDrawCallback": function( oInstance, json ) { 
			jeditable_bind(this[0].id);
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { 
				redirect(json.error_msg); 
			}
		},
 		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "No zones configured - <a href='#tbl_relays-dialog' data-toggle='modal'>Add an Irrigation Zone</a>"
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=relays&v2'
	} );

	$.getJSON(baseURL + 'php/get_customer_details.php?type=master_relay', function(results){
		if( typeof(results.error_msg) != 'undefined' ) {
			redirect(results.error_msg);
		} else {
			$('#master_relay').html(results.relay_number);
		}
	});

	$('#master_relay').editable( baseURL + "php/process_tablerequest.php", 
	{ 
  		loadurl  : baseURL + 'php/get_select.php',
  		loaddata : loadDataRaw,
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : function() {
						var dataString = new Array();					
						dataString['table'] = 'tbl_controller';
						dataString['field'] = 'master_relay';
						dataString['value'] = $(this).find('select option:selected').val();
						dataString['displayvalue'] = $(this).find('select option:selected').text();
						return(dataString);
						},
  		type	 : 'select',
  		tooltip	 : 'Click to edit...',
  		placeholder: '',
  		submit   : 'OK',
  		cancel   : 'Cancel',
  		style	 : 'inherit',
  		onblur 	 : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});

	refreshControllers('refreshZones');
	
	changeTimeSelect();
}

function changeTimeSelect()
{
	$('#water_type-msg').html($('#water_type option:selected').attr('title'));
}

function formatPrice(price)
{
	if( price > 0 ) {
		return '$' + price;
	}
	return '';
}

function updatePricing()
{
	$("#total").html("<img src='images/spinner_small.gif'/>");
	var purchase_url = baseURL + 'php/get_customer_details.php?type=buynow_totals&' + $("#purchase_details").serialize();
    $.ajax({
	    url: purchase_url,
	    dataType: 'json',
	    success: function(result) {
	        if( result ) {
	        	$("#logged_in").val( result.logged_in );
                $("#controller_total").html(formatPrice(result.controller.total));
                $("#controller_description").html(result.controller.description);
                $("#plan_total").html(formatPrice(result.new_plan.total));
                $("#description").html(result.new_plan.description);
                $("#flowmeter_total").html(formatPrice(result.flowmeter_total));
                $("#accessory_total").html(formatPrice(result.accessory_total));
                $("#shipping_total").html(formatPrice(result.shipping_total));
                
                if( result.current_plan ) {
                	$("#current_plan").html("Your current plan is " + result.current_plan.name + " and expires in " + result.current_plan.time +".");
                }
                
                $("#total").html(result.total);
                if( result.total == 0 ) {
	                $('#purchase_btn').attr('disabled', 'disabled');
                } else {
	                $('#purchase_btn').removeAttr('disabled');           
                }
	        }
	    }
    });
}

function triggerChange()
{
	$('#trigger-msg').html($('#trigger_id option:selected').attr('title'));
}

function chooseWaterDays()
{
	$(".water-content").hide();
	$("#water-content-" + $('#time_type option:selected').val()).show();
}

function chooseCustomerType()
{
	$(".create_controller").hide();
	$("#create_controller-" + $('#customer_type option:selected').val()).show();
}

function triggers_update()
{
	$.getJSON(baseURL + 'php/get_customer_details.php?type=triggersettings', function(results){
		if( results.error_msg ) {
			// redirect - not logged in
			redirect(results.error_msg);
		} else {
			$('#suspend_water_temp_enable').attr('checked', results.suspend_water_temp_enable == 1 ? true : false).change();
			$('#suspend_water_rain_enable').attr('checked', results.suspend_water_rain_enable == 1 ? true : false).change();
			$('#suspend_water_week_rain_enable').attr('checked', results.suspend_water_week_rain_enable == 1 ? true : false).change();
			$('#extend_water_temp_enable').attr('checked', results.extend_water_temp_enable == 1 ? true : false).change();

			$("#suspend-temp-value").html(results.suspend_water_temp);
			$("#suspend_water_temp").data('slider-value', parseInt(results.suspend_water_temp,10));
			$("#suspend-rain-value").html(results.suspend_water_rain);
			$("#suspend_water_rain").data('slider-value', parseInt(results.suspend_water_rain,10));
			$("#suspend-rain_week-value").html(results.suspend_water_week_rain);
			$("#suspend_water_week_rain").data('slider-value', parseInt(results.suspend_water_week_rain,10));
			$("#extend-temp-value").html(results.extend_water_temp);
			$("#extend_water_temp").data('slider-value', parseInt(results.extend_water_temp,10));

			$('.triggers-content').show();

			if( results.features.rainfall == 0 ) {
				$("input .rainfallTrigger").prop('disabled', true)
				$(".rainfallTrigger").addClass('hide');
				$(".rainfallPlanEnable").show();
			} else {
				$("input .rainfallTrigger").prop('disabled', false)
				$(".rainfallTrigger").removeClass('hide');
				$(".rainfallPlanEnable").hide();
			 	$('.rainfallPlan').toggleButtons({
					onChange: function ($el, status, e) {
						updateSettings($el.find('input')[0].id + "=" + (status === false ? 0 : 1));
					}
				});
			}
			$(".planName").html(results.features.planType);
 
		 	$('.basePlan').toggleButtons({
				onChange: function ($el, status, e) {
					updateSettings($el.find('input')[0].id + "=" + (status === false ? 0 : 1));
				}
			});
   		
			$('#suspend_water_rain, #suspend_water_week_rain').empty().slider( { 
				min: parseInt(results.limits.rain_min, 10),
				max: parseInt(results.limits.rain_max, 10),
				step: 0.1,
				value: 1,
				tooltip: 'hide'
			})
			.on('slideStop', function(ev) { 
				updateSettings(this.id + '=' + ev.value.toFixed(1));
			})
			.on('slide', function(ev) { 	
				var infoText = $(this).closest('.suspendItem').find('.infoBox');
				infoText.text(ev.value.toFixed(1)); 		
			});


			$('#suspend_water_temp, #extend_water_temp').empty().slider( { 
				min: parseInt(results.limits.temp_min, 10),
				max: parseInt(results.limits.temp_max, 10),
				step: 1,
				tooltip: 'hide'
			})
			.on('slideStop', function(ev) { 
				updateSettings(this.id + '=' + ev.value.toFixed(0));
			})
			.on('slide', function(ev) { 	
				var infoText = $(this).closest('.suspendItem').find('.infoBox');
				infoText.text(ev.value.toFixed(0)); 		
			});

			function resultLocal() { return results.limits; }
			
			$('.rainUnitMin').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.rain_min); 
			} );
			$('.rainUnitMax').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.rain_max);
			} );
			$('.rainUnitMaxWeek').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.rain_max_week); 
			} );
			$('.tempUnitMin').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.temp_min); 
			} );
			$('.tempUnitMax').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.temp_max); 
			} );

			$('.rainUnit').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.rain_unit); 
			} );
			$('.tempUnit').each( function() { 
				var results_local = resultLocal();
				$(this).html(results_local.temp_unit); 
			} );

			$('#triggersLoading').hide();
		}
	});
}

// startup function for weather triggers
function triggers_startup()
{
	triggers_update();

	refreshControllers('refreshTriggers');
}

var originalAddress='';
function mylocation_startup()
{	
	$("#update-button").button('reset');

	$( "#moveLocation-dialog" ).on( 'click', '.yesbtn' , function() {
		updateLocation($('#address_1').val(), 1);
		$("#moveLocation-dialog").modal("hide");
	});
	

	$( "#moveLocation-dialog" ).on( 'click', '.nobtn' , function() {
		updateLocation($('#address_1').val(), 0);
		$("#moveLocation-dialog").modal("hide");
	});

	$('#address_1').keypress(function(e) {
	    if( e.which == 13 ) {
			$( "#update-button" ).click();
	    }
	});

	$( "#update-button" ).click(function() {
		if( $('#address_1').val() != originalAddress ) {
			if( parseInt($('#selectedSensors').html(), 10) > 0 ) {
				// they are moving location and we have selected sensors
				$("#moveLocation-dialog").modal( "show" );
			} else {
				updateLocation($('#address_1').val(), 1);
			}
		}
	});

	$.getJSON(baseURL + 'php/get_customer_details.php?type=location', function(results){
		if( results.error_msg ) {
			redirect(results.error_msg);
		} else {
	   		$('#locationLoading').hide();
			if( results.address_1 ) {
				$('#address_1').val(results.address_1);
				originalAddress = results.address_1;
		    	updateMap();	
			} else {
		    	$('#addressInfoMsg').html("Please enter your controller's full address and click <i>Update Address</i>");
				$('#addressInfo').show();	
			}
	    }
	});

	refreshControllers('refreshLocation');
}

function refreshTriggers()
{
	triggers_update();
}

function flow_startup()
{
	$( "#alert-dialog" ).on('show', function(){
			$.ajax({
  				url: baseURL + 'php/get_select_json.php?table=tbl_flowsensor_alert_trigger&field=name&title=units',
  				dataType: 'json',
  				success: function(result) {
					if(result) {
						$("select#trigger_id").html(createSelectHTML(result));
						triggerChange();
					} else {
						alert('There was an error with the server. Please try again');
					}
    			}
			});
			$.ajax({
  				url: baseURL + 'php/get_select_json.php?table=tbl_flowsensor_alert_condition&field=name',
  				dataType: 'json',
  				success: function(result) {
					if(result) {
						$("select#condition_id").html(createSelectHTML(result));
					} else {
						alert('There was an error with the server. Please try again');
					}
    			}
			});
			$.ajax({
  				url: baseURL + 'php/get_select_json.php?table=tbl_users&field=name',
  				dataType: 'json',
  				success: function(result) {
					if(result) {
						$("select#user_id").html(createSelectHTML(result));
					} else {
						alert('There was an error with the server. Please try again');
					}
    			}
			});
	});
	
	$( "#alert-dialog" ).on('click', '.submitbtn', function(){
		var loadurl = baseURL + 'php/add_row_json.php?table=tbl_flowsensor_alerts&alert_label=' + $('#alert_description').val() + '&condition_id=' + $('#condition_id').val() + '&user_id=' + $('#user_id').val() + '&trigger_id=' + $('#trigger_id').val() + '&value=' + $('#value').val() + '&sms=' + $('#sms').val()
		$( "#alert-dialog" ).find(".submitbtn").button('loading');
		$.ajax({
				url: loadurl,
				dataType: 'json',
				async: false,
				success: function(j) {
					$( "#alert-dialog" ).find(".submitbtn").button('reset');
					if( j.error_msg != null ) {
						$('#alert_error_msg')[0].innerHTML = j.error_msg;
						$('#alert_error').show();
					} else {
						$('#tbl_flowsensor_alert').dataTable().fnReloadAjax();
						$('#alert-dialog').modal("hide");
					}
				},
				error: function() {
					$( "#alert-dialog" ).find(".submitbtn").button('reset');
				}
		});
	});

	$( "#sensor-dialog" ).on('show', function(){
 		$('#sensor_error').hide();
		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_flowsensor_model&exclude&all',
				dataType: 'json',
				success: function(result) {
				if(result) {
					$("select#sensor_model").html(createSelectHTML(result));
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
		});

		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_controller&field=name',
				dataType: 'json',
				success: function(result) {
				if(result) {
	  				$("select#controller_id").html(createSelectHTML(result));
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
		});

		$.ajax({
				url: baseURL + 'php/get_select_json.php?table=tbl_flowsensor_input',
				dataType: 'json',
				success: function(result) {
				if(result) {
	  				$("select#controller_input_id").html(createSelectHTML(result));
				} else {
					alert('There was an error with the server. Please try again');
				}
			}
		});
	});

	$( "#flowsensor-dialog" ).on('click', '.submitbtn', function(){
 		$('#flowsensor_error').hide();
		$( "#flowsensor-dialog" ).find(".submitbtn").button('loading');
		var loadurl = baseURL + 'php/add_row_json.php?table=tbl_flowsensormodel&' + $('#flowsensor_dialog_form').serialize();
		$.ajax({
			url: loadurl,
			dataType: 'json',
			async: false,
			success: function(j) {
				$( "#flowsensor-dialog" ).find(".submitbtn").button('reset');
				if( j.error_msg != null ) {
					$('#flowsensor_error_msg')[0].innerHTML = j.error_msg;
					$('#flowsensor_error').show();
				} else {
					// refresh models
					$.ajax({
							url: baseURL + 'php/get_select_json.php?table=tbl_flowsensor_model&exclude&all',
							dataType: 'json',
							success: function(result) {
							if(result) {
								$("select#sensor_model").html(createSelectHTML(result));
							} else {
								alert('There was an error with the server. Please try again');
							}
						}
					});
					$('#flowsensor-dialog').modal("hide");
				}
			},
			error: function() {
				$( "#flowsensor-dialog" ).find(".submitbtn").button('reset');
			}
		});
	});

	$( "#sensor-dialog" ).on('click', '.submitbtn', function(){
		$( "#sensor-dialog" ).find(".submitbtn").button('loading');
		var loadurl = baseURL + 'php/add_row_json.php?table=tbl_flowsensor&' + $('#sensor_dialog_form').serialize();
		$.ajax({
			url: loadurl,
			dataType: 'json',
			async: false,
			success: function(j) {
				$( "#sensor-dialog" ).find(".submitbtn").button('reset');
				if( j.error_msg != null ) {
					$('#sensor_error_msg')[0].innerHTML = j.error_msg;
					$('#sensor_error').show();
				} else {
					$('#sensor-dialog').modal("hide");
  					$('#tbl_flowsensor').dataTable().fnReloadAjax();
					}
			},
			error: function() {
				$( "#sensor-dialog" ).find(".submitbtn").button('reset');
			}
		});
	});

	$('#tbl_flowsensor_alert').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "alert_id", "bVisible": false },
			{ "mData": 1, "sClass": "jedit_text"},
			{ "mData": 2, "sClass": "jedit_select"},
			{ "mData": 3, "sClass": "jedit_select"},
			{ "mData": 4, "sClass": "jedit_text"},
			{ "mData": 5, "sClass": "jedit_select"},
			{ "mData": 6, "sClass": "jedit_text"},
			{ "mData": 7, "sClass": "centre"}
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"bAutoWidth": false,
		"sDom": 'lfrti',
        "fnDrawCallback": function( oInstance, json ) { 
			jeditable_bind(this[0].id);
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { 
				redirect(json.error_msg); 
			} 
		},
		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "No flow alerts are configured - <a data-toggle='modal' href='#alert-dialog'>Add an Flow Meter Alert</a>"
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=flow_alerts'
	} );

	$('#tbl_flowsensor').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "sensor_id", "bVisible": false },
			{ "mData": 1, "sClass": "jedit_text"},
			{ "mData": 2, "sClass": "jedit_select"},
			{ "mData": 3, "sClass": "jedit_select"},
			{ "mData": 4, "sClass": "jedit_select"},
			{ "mData": 5, "sClass": "chosen_edit"},
			{ "mData": 6, "sClass": "centre"}
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"bAutoWidth": false,
		"sDom": 'lfrti',
        "fnDrawCallback": function( oInstance, json ) { 
			jeditable_bind(this[0].id);
			$("#tbl_flowsensor .chosen").chosen({placeholder_text: 'Select zones'});
			$("#tbl_flowsensor .chosen").chosen().change( function() {
				var sensor = this.id.split('-');
				var dataString = 'table=tbl_sensorassignments&sensor_id=' + sensor[1] + '&' + $(this).serialize();
			  	$.ajax({
					type: "POST",
					url: baseURL + "php/process_tablerequest.php",
					dataType: 'json',
					data: dataString,
					success: function(response) {
					},
					error: function() {
						$( "#general-error" ).modal("show");
					}
			   	});
			});
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { 
				redirect(json.error_msg); 
			} 
		},
		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "No sensors are configured - <a data-toggle='modal' href='#sensor-dialog'>Add a Sensor</a>"
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=flowsensors'
	} );

	$(".tt").tooltip();

	refreshControllers('refreshFlow');
}

function loadDataRaw(value, settings)
{
   	if( settings.type == 'select' )
   	{
		var extra_fields = new Array();
		extra_fields['table'] = this.id;
		return(extra_fields);
	} else {
		return(value);
	}
}


function updateDetails(self, value, settings)
{
	var displayvalue;
   	if( settings.type == 'select' )
   	{
		value = $(self).find('select option:selected').val();
		displayvalue = $(self).find('select option:selected').text();
    } else {
		value = $(self).find('input').val();
		displayvalue = value;
    }
	updateSettings(self.id + '=' + value);		
	return(displayvalue);
}


function mydetails_startup()
{
	$( "#add_controller-dialog" ).on('show', function(){
		$('#controller_error').hide();
		$( "#add_controller-dialog" ).find(".submitbtn").button('reset');
		$.ajax({
			url: baseURL + 'php/get_select_json.php?table=customers',
			dataType: 'json',
			success: function(result) {
				$("select#customer_account_id").html(createSelectHTML(result));
			},
			error: function() {
				alert("Request timed out. Please close and open this dialog again");
			}
		});
	});

	$( "#add_controller-dialog" ).on('click', '.submitbtn', function(){
		var loadurl = baseURL + 'php/get_customer_details.php?type=create_controller&' + $('#add_controller-form').serialize();
		$( "#add_controller-dialog" ).find(".submitbtn").button('loading');
	    $( "#add_controller-dialog" ).find(".submitbtn").attr('disabled', 'disabled');
 		$.ajax({
			url: loadurl,
			dataType: 'json',
			async: false,
			success: function(j) {
				$( "#add_controller-dialog" ).find(".submitbtn").removeAttr('disabled');
				$( "#add_controller-dialog" ).find(".submitbtn").button('reset');
				if( j.error_msg != null ) {
					$('#controller_error_msg')[0].innerHTML = j.error_msg;
					$('#controller_error').show();
				} else {
					$("#add_controller-dialog").modal( "hide" );
					$('#tbl_controllers').dataTable().fnReloadAjax();
					alert("Successfully created controller");
				}
			},
			error: function() {
				$( "#add_controller-dialog" ).find(".submitbtn").removeAttr('disabled');
				$( "#add_controller-dialog" ).find(".submitbtn").button('reset');
			}
		});
	});	

	$.getJSON(baseURL + 'php/get_customer_details.php?type=customer', function(results){
		if( results.error_msg) {
			redirect(results.error_msg);
		} else {
			$("#controller_name").html(results.name);
			jQuery.each(results, function(i, val) {
				$('#'+i).html(val);
			});
		}
	});

	$('span.jedit_text').editable( function(value, settings) { return updateDetails(this, value, settings); }, 
	{ 
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		type	 : 'text',
  		tooltip	 : 'Click to edit...',
  		submit   : 'OK',
  		width    : ($("span").width() + 200) + "px",
  		cancel   : 'Cancel',
  		style	 : 'inherit',
  		onblur    : 'submit',
  		callback  : checkData
	});

	$('span.jedit_select').editable( function(value, settings) { return updateDetails(this, value, settings); }, 
	{ 
  		loadurl  : baseURL + 'php/get_select.php',
  		loaddata : loadDataRaw,
  		indicator : "Saving... <i class='icon-spinner icon-spin'></i>",
  		loadtext : "Loading... <i class='icon-spinner icon-spin'></i>",
		submitdata : submitDataRaw,
		type	 : 'select',
  		tooltip	 : 'Click to edit...',
  		placeholder: '',
  		submit   : 'OK',
  		cancel   : 'Cancel',
  		style	 : 'inherit',
  		onblur 	 : 'submit',
  		ajaxoptions : { dataType: 'json', async : false },
  		callback  : checkData
	});

	$('#tbl_controllers').dataTable( {
		"aoColumns": [ 
			{ "mData": 0, "sClass": "controller_id", "bVisible": false },
			{ "mData": 1 },
			{ "mData": 2, "sClass": "jedit_text"},
			{ "mData": 3, "sClass": "jedit_text"},
			{ "mData": 4 },
			{ "mData": 5 }
		],
		"bProcessing": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": true,
		"bSort" : true,
		"iDisplayLength" : 40,
		"bAutoWidth": false,
		"sDom": 'lfrtipr',
        "fnDrawCallback": function( oInstance, json ) { 
			jeditable_bind(this[0].id);
		},
		"fnInitComplete": function( oInstance, json ) { 
			if( json.error_msg ) { redirect(json.error_msg); }
		},
 		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading...",
			"sEmptyTable": "</i>You have no controllers associated with your account</i>"
		},
		"sAjaxSource": baseURL + 'php/get_json_data.php?type=controllers'
	} );
	refreshControllers('refreshDetails');
}

function refreshDetails()
{
	$.getJSON(baseURL + 'php/get_customer_details.php?type=customer', function(results){
		if( results.error_msg) {
			redirect(results.error_msg);
		} else {
			$("#controller_name").html(results.name);
			jQuery.each(results, function(i, val) {
				$('#'+i).html(val);
			});
		}
	});
	$('#tbl_controllers').dataTable().fnReloadAjax();
}

function deleteController(controller)
{
	if( confirm('This action cannot be undone - are you sure?') ) {
		var dataString = "table=tbl_controller&field=delete_controller&value="+controller;
	  	$.ajax({
			type: "POST",
			url: baseURL + "php/process_tablerequest.php",
			dataType: 'json',
			data: dataString,
			success: function(response) {
				if( response.error_msg != null ) {
					alert( response.error_msg );
				} else {
					if( response.refresh ) {
						for(var index in response.refresh) {
		  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
						}
					}
				}
			},
			error: function() {
				$( "#general-error" ).modal("show");
			}
	   	});
	}
}

function showWaterSchedule(element)
{
	var element_id = element.id.split('-');
	var id = element_id[1];
	
	$( "#schedule-dialog" ).modal("show");
	 
	$('#tbl_schedule').dataTable({
		"aoColumns": [ 
			{"mData": 0 },
			{"mData": 1 },
			{"mData": 2 }
		],
		"bProcessing": true,
		"bDestroy": true,
		"bRetrieve": true,
		"bLengthChange": false,
		"bInfo": false,
		"bFilter": false,
		"bSort" : false,
		"iDisplayLength" : 20,
		"bAutoWidth": true,
		"sDom": 'lfrti',
 		"oLanguage": {
			"sProcessing": "<i class='icon-spinner icon-spin'></i> Contacting server...",
			"sLoadingRecords": "Please wait - loading..."
		},
	} );

	$('#tbl_schedule').dataTable().fnReloadAjax( baseURL + 'php/get_json_data.php?type=waterschedule&relay='+id );
}

// Called by jeditable before data sent to server
function submitDataTable(self, settings)
{
	element = this;
	var tableElement = element.parentNode.parentNode.parentNode;
	var aPos = $('#'+tableElement.id).dataTable().fnGetPosition( element );
	var aData = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0];
	var id = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0]; // tr

	var columnID = tableElement.children[0].children[0].cells[aPos[1]].id;
	var tableID = columnID.split("-");
	var dataString = new Array();

	var value;
   	if( settings.type == 'select' ) {
		value = $(this).find('select option:selected').val();
		displayvalue = $(this).find('select option:selected').text();
    } else {
		value = $(this).find('input').val();
		displayvalue = value;
    }
	
	dataString['table'] = tableID[0];
	dataString['id'] = id;
	dataString['field'] = tableID[1];
	dataString['value'] = value;
	dataString['displayvalue'] = displayvalue;
	return(dataString);
}

function submitDataRaw(self, settings) 
{
	var dataString = {};	
	var name = this.id;				
   	if( settings.type == 'select' ) {
		dataString[name] = $(self).find('select option:selected').val();
    } else {
		dataString[name] = $(self).find('input').val();
    }
    dataString['fred'] = 5;
    dataString[name] = 7;
	return(dataString);
}

// Called by jeditable after response from server
function checkData(response, result, settings)
{
	if( typeof response == 'object' ) {
		if( response.error_msg ) {
			this.innerHTML = this.revert
			$( '#general-info-content').html(response.error_msg);
			$( "#general-info" ).modal("show");
		} 
		else {
		   	if( response.value ) {
				this.innerHTML = response.value;
			} else {
				this.innerHTML = '';
			}

			if( response.refresh ) {
				for(var index in response.refresh) {
  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
				}
			}
		}
	}
}

// Called by jeditable before select sent to server
function loadDataTable(self, settings)
{
	var element = this;
	var tableElement = element.parentNode.parentNode.parentNode;
	var aPos = $('#'+tableElement.id).dataTable().fnGetPosition( element );
	var aData = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0];
	var id = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0]; // tr

	var columnID = tableElement.children[0].children[0].cells[aPos[1]].id;
	var tableID = columnID.split("-");
	
	var extra_fields = new Array();
	extra_fields['table'] = tableID[1];
	return(extra_fields);
}

function redirectWizard() 
{
	window.location = location.protocol + '://' + location.hostname + '/config/wizard.php';
}

// called when someone click on subscribe or unsubscribe buttons on Google Map
function subscribeMarker(markerID) {
	var markerObj = $('#map').data()[markerID];
	var infoHTML = $.goMap.getInfo(markerID, false);
	var selectedSensors = parseInt($('#selectedSensors').html(), 10);
	var newinfoHTML;
	
	var source = $(infoHTML).find('input[type=hidden]').val();
	var icon;
	
	if( markerObj.getIcon() == 'images/sensor_32x32.png' )
	{
		action = 'delete';
		newinfoHTML = infoHTML.replace("Unsubscribe", "Subscribe");
		newinfoHTML = newinfoHTML.replace("btn-warning", "btn-success");
		$.goMap.setInfo(markerID, newinfoHTML);
		$('#selectedSensors').html(selectedSensors - 1);
		switch( source ) {
			case '3':
				icon = 'images/marker_official.png';
				break;
			case '4':
				icon = 'images/marker_metar.png';
				break;
			default:
				icon = 'images/marker_32x32.png';
				break;	
		}
		changeMarkerCount(source, 1);
		markerObj.setIcon(icon);
	}  else {
		action = 'add';
		changeMarkerCount(source, -1);
		markerObj.setIcon('images/sensor_32x32.png');
		newinfoHTML = infoHTML.replace("Subscribe", "Unsubscribe");
		newinfoHTML = newinfoHTML.replace("btn-success", "btn-warning");
		$.goMap.setInfo(markerID, newinfoHTML);
		$('#selectedSensors').html(selectedSensors + 1);
	}
	selectedSensors = parseInt($('#selectedSensors').html(), 10);
	checkNumSensors(selectedSensors);
	
	$.ajax({
		url: baseURL + 'php/set_marker_single.php',
		cache: false,
		dataType: 'json',
		data: 'action='+action+'&url='+markerID + "&lat="+markerObj.getPosition().lat()+"&lon="+markerObj.getPosition().lng()+'&source='+source,
		success: function(response) {},
		error: function(response) { alert('something went wrong') }
	});
}	

// check number of selected sensors and add error message if not enough selected
function checkNumSensors(selectedSensors)
{
	if( selectedSensors < 2 ) {
		$('#sensorErrorMsg').html('<p>You should subscribe to a minimum of 2 Weather Stations close to your HydraWise Controller to get accurate rainfall statistics.</p><p>To subscribe to a Weather Station click on a green icon on the map and then click the Subscribe button.</p>');
		$('#sensorError').show(1);
	} else {
		$('#sensorError').hide(1);
	}
}	

function toggleDay(element)
{
	$('i', element).toggle();
}

function toggleTable(element)
{
	var tableElement = $(element).closest('table')[0];
	var aPos = $('#'+tableElement.id).dataTable().fnGetPosition( element );
	var aData = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0];
	var id = $('#'+tableElement.id).dataTable().fnGetData( aPos[0] )[0]; // tr

	var columnID = tableElement.children[0].children[0].cells[aPos[1]].id;
	var tableID = columnID.split("-");

	// toggle element
	var iconElement = $(element).find('i');
	var value;

	if( $(iconElement).hasClass('enabled') ) {
		// turning this one off!
		$(iconElement).removeClass('icon-ok-sign')
		value = 0;
	}
	else {
		value = 1;
	}	
	$(iconElement).addClass('icon-spinner icon-spin');
  	
	// update database
	var dataString = "table=tblwatersettings&id="+id+"&field="+tableID[1]+"&value="+value;
  	$.ajax({
		type: "POST",
		url: baseURL + "php/process_tablerequest.php",
		dataType: 'json',
		data: dataString,
		success: function(response) {
			if( response.error_msg != null ) {
				alert( response.error_msg );
			} else {
				if( response.refresh ) {
					for(var index in response.refresh) {
	  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
					}
				}
			}
		},
		error: function() {
			$( "#general-error" ).modal("show");
		}
   	});
}

// update units when selected
function updateSettings(dataString)
{
  	$.ajax(
  	{
		type: "POST",
		url: baseURL + "php/process_request.php",
		data: dataString,
		dataType: 'json',
		error: function()
		{
	  		$( "#general-error" ).modal("show");
		},
		success: function(response) {
			if( response.error_msg ) {
				$( '#general-info-content').html(response.error_msg);
				$( "#general-info" ).modal("show");
			}
		}
   	});
}

var chart;
var options = {
	  chart: {
	     renderTo: 'container',
	     zoomType: 'x',
	     defaultSeriesType: 'column'
	  },
      credits: {
		 enabled: false
	  },
	  title: {
	     text: ''
	  },
	  subtitle: {
	  	text: 'Click and drag in the plot area to zoom in'
	  },
	  xAxis: {
		type: 'datetime',
         labels: {
            rotation: -45,
            align: 'right',
            style: {
                font: 'normal 11px Verdana, sans-serif'
            }
         }
	  },
	  yAxis: [
	  {
	     title: {
	        text: ''
	     }
	  },
	  {
	     title: {
	        text: ''
	     }
	  }
	  ],
	  plotOptions: {
		series: {
    		pointWidth: 10,
            groupPadding: 0.5
		},
		spline: {
            lineWidth: 4,
			marker: {
			   enabled: false,
			   states: {
			      hover: {
			         enabled: true,
			         symbol: 'circle',
			         radius: 5,
			         lineWidth: 1
			      }
			   }   
			}
		}
	  },
	  events: {
	    legendItemClick: function(event) {
	        var visibility = this.visible ? 'visible' : 'hidden';
	        if (!confirm('The series is currently '+ 
	                     visibility +'. Do you want to change that?')) {
	            return false;
	        }
	    }
	  },
	  exporting: {
	  	enabled: true,
	  	enableImages: true
	  },
	  tooltip: {
		   formatter: function() {
		   		var title = '<strong>'+ this.series.name +'</strong><br>'+ this.point.note + '<br>';
		   		var rt = $('.report-type.active').data('report');
		   		switch( rt ) {
		   			case 0:
		   				var seconds = this.y * 60;
			   			return title + Highcharts.dateFormat('%A %e %B, %l:%M%P', this.x) +'<br>Run time: '+ Math.floor(seconds/60) + this.point.units + ' ' + Math.round(seconds % 60) + 's';
		   				break;
		   			case 3:
			   			return title + Highcharts.dateFormat('%A %e %B, %l:%M%P', this.x) +'<br>Temperature: '+ this.y + ' ' + this.point.units;
		   				break;
		   			case 5: // rain daily
			   			return title + Highcharts.dateFormat('%A %e %B', this.x) +'<br>Rainfall: '+ this.y + ' '  + this.point.units;
		   				break;
		   			case 4:
			   			return title + Highcharts.dateFormat('%A %e %B, %l:%M%P', this.x) +'<br>Rainfall: '+ this.y + ' '  + this.point.units;
		   				break;
		   			case 2:
			   			return title + Highcharts.dateFormat('%A %e %B', this.x) +'<br>Water saving: '+ this.y + ' '  + this.point.units;
		   				break;
		   			case 6:
			   			return title + Highcharts.dateFormat('%A %e %B %l:%M%P', this.x) +'<br>Water usage: '+ this.y + ' '  + this.point.units;
		   				break;		   			
		   			case 7:
			   			return title + Highcharts.dateFormat('%A %e %B %l:%M%P', this.x) +'<br>Flow rate: '+ this.y + ' '  + this.point.units;
		   				break;
		   			default:
			   			return title + Highcharts.dateFormat('%A %e %B %l:%M%P', this.x) +'<br>Value: '+ this.y + ' '  + this.point.units;
		   				break;
		   		}
			   }
	  },
	  series: []
};

function addSensor(id)
{
}

function updateChart(report_type, period) 
{
	$('#no-results').hide();
	
	$.ajax({
			url: baseURL + 'php/get_water_history.php?action=view&option=' + period + "&type=" + report_type,
			dataType: 'json',
			success: function(data) {
				if( data.error_msg ) {
					redirect(data.error_msg);
				} else {
					$('.report-type').removeClass('active');
					$('.report-period').removeClass('active');
					$("li[data-report='" + data.type + "']").addClass('active');
					$("li[data-period='" + data.option + "']").addClass('active');

					if( data.message ) {
						$('#resultsMsg').html(data.message);
						$('#no-results').show();
					} else {
						$('#no-results').hide();
					}
					
					if( data.results == null ) {
						$('#container').hide();
					} else {
						$('#container').show();
						options.series = data.results;
						options.yAxis[0].title.text = data.yaxis;
						options.xAxis.min = data.xmin;
						options.xAxis.max = data.xmax;
						options.yAxis[0].min = data.ymin;
						if( data.yaxis2 ) {
//							options.yAxis[1].title.text = data.yaxis2;
						}
						chart = new Highcharts.Chart(options);
					}
				}
			},
			error: function() {
				$('#resultsMsg').html("Request timed out - please try again.");
				$('#no-results').show();				
				$('#container').hide();
				}
		});
}

function createSelectHTML(data)
{
	var options = '';
	for (var i = 0; i < data.length; i++) {
		options += '<option ';
		if( data[i].title != null ) {
			 options += 'title="' + data[i].title + '"';
		}
		if( data[i].selected != null ) {
			options += ' selected ';
		}
		options += 'value="' + data[i].id + '">' + data[i].value + '</option>';
	}
	return(options);
}

// Update map when someone changes address
function updateLocation(newLocation, removeMarkers) {
	// show updating spinner & disable find button
	$("#update-button").button('loading');
	
	// hide any existing errors
	$('#addressInfo').hide();
	$('#mapError').hide();

	originalAddress = newLocation;
				
	// go and update address
	var update_string = "address_1=" + newLocation +'&remove=' + removeMarkers;
	$.ajax({
			url: baseURL + 'php/setlocation.php?'+update_string,
			dataType: 'html',
			success: function(j) {
				// location update was successful, now see if we can find the location
				updateMap();							
				$("#update-button").button('reset');
			},
			error: function() {
				$("#update-button").button('reset');				
			}
		});	
}

function changeMarkerCount(source, amount)
{
	switch( source ) {
		case '3':
			$('#bomLegend').show();
			objectCounter = $('#bomSensors');
			break;
		case '4':
			objectCounter = $('#metarSensors');
			break;
		default:
			objectCounter = $('#pwsSensors');
			break;
	}
	var loaded = parseInt(objectCounter.html(), 10);
	objectCounter.html(loaded + amount);
}

function updateMap(lat, lon, units) {
	var street_address = $('#address_1').val();

	if(typeof lat === 'undefined') {
		street_address = 'address=' + $('#address_1').val();
	} else {
		if( $('#address_1').val().length == 0 ) {
			street_address = 'lat=' + lat + '&lon=' + lon + '&units=' + units;
		} else {
			street_address = 'address=' + $('#address_1').val();
		}
	}

  	$.ajax(
  	{
		url: baseURL + "php/get_marker_list.php",
		cache: false,
		dataType: "json",
		data: street_address + '&quantity=10',
		success: function(myMarkers)
		{
			var index;	
			$('#bomSensors').html('0');
			$('#metarSensors').html('0');
			$('#pwsSensors').html('0');
			$('#selectedSensors').html('0');
			$( "#update-button" ).button( "enable" );
			if( myMarkers.plan_message ) {
				$('#plan_message').html(myMarkers.plan_message);
				$('#planMessage').show();	
			} else {
				$('#planMessage').hide();	
			}
			if( myMarkers.error_msg ) {
				// can't resolve location
				$('#addressInfoMsg').html(myMarkers.error_msg);			
				$('#addressInfo').show();
				$('#mapContainer').hide();
			} else {
				$('#availableSensors').html(myMarkers.availableSensors);
				if( myMarkers.unhealthySensors > 0 ) {
					$('#unhealthySensors').html('(' + myMarkers.unhealthySensors + ' unhealthy)');
				}
				$('#selectedSensors').html(myMarkers.selectedSensors);

				if( myMarkers.home != null )
				{					
					$('#mapContainer').show();
					
					$('#map').goMap({ 
				        maptype: 'HYBRID' 
				    });

					$.goMap.clearMarkers();
							
					// create home marker
				 	$.goMap.createMarker( myMarkers.home );
					
					// create markers for all the existing observation stations 
					if( myMarkers.station != null ) {
						$('#map_error').hide(1);
						for(index in myMarkers.station) {
							$.goMap.createMarker( myMarkers.station[index] );
						}
					}
											
					if( myMarkers.availableSensors == 0 ) {
						$('#mapErrorMsg').html('We are unable to find any HydraWise weather stations in your local area. Try entering a larger town');			
						$('#mapError').show();
					}

					// create markers for all the potential observation stations
					if( myMarkers.list != null ) {
						$('#stationLoading').show();
						$('#stationLoaded').hide();
						$('#stationCountRemaining').val(myMarkers.total - myMarkers.selectedSensors);
						for(index in myMarkers.list) {
						  	$.ajax(
						  	{
								url: baseURL + "php/get_marker_single.php",
								cache: false,
								dataType: "json",
								data: 'station=' + myMarkers.list[index].id+'&source=' + myMarkers.list[index].source,
								success: function(singleMarker)
								{
									$('#stationCountRemaining').val($('#stationCountRemaining').val() - 1);
									if( $('#stationCountRemaining').val() == 0 ) {
										$('#stationLoading').hide();
										$('#stationLoaded').show();
									}
									if( singleMarker.id != null ) {
										var objectCounter;
										$.goMap.createMarker( singleMarker );
										$.goMap.fitBounds();
										changeMarkerCount(singleMarker['source'], 1)
									}
								}	
							});
						}
						var selectedSensors = parseInt($('#selectedSensors').html(), 10);
						checkNumSensors(selectedSensors);	
					}
					$.goMap.fitBounds();						
				} else {
					$('#addressInfoMsg').html("We are unable to find the location you entered. Please check the address and try again");			
					$('#addressInfo').show();
					$('#mapContainer').hide();
				}
			}	
		},
		error: function(myMarkers)
		{
			$( "#update-button" ).button( "enable" );
	  		$( "#general-error" ).modal("show");
		}
   	});
}

function upgradePlanCode() {
	var loadurl = baseURL + 'php/get_customer_details.php?type=change_plan&upgrade_code=' + $("#upgrade_code").val();
	$("#code_upgrade").button('loading');
	$.ajax({
		url: loadurl,
		dataType: 'json',
		async: false,
		success: function(j) {
			$("#code_upgrade").button('reset');
			if( j.error_msg != null ) {
				$('#changeplan')[0].innerHTML = j.error_msg;
				$('#changeplan').show();
			} else {
				$("#changeplan-dialog").modal("hide");
				$.getJSON(baseURL + 'php/get_customer_details.php?type=customer', function(results){
					if( results.error_msg) {
						redirect(results.error_msg);
					} else {
						$("#controller_name").html(results.name);
						jQuery.each(results, function(i, val) {
							$('#'+i).html(val);
						});
					}
				});						
				alert(j.message);
			}
		},
		error: function() {
			$("#code_upgrade").button('reset');
			alert("Your request timed out. Please try again.");
		}
	});
}

function changeActiveController(fnCallback, controller_id)
{
	$('#controller-dialog').modal("hide");

	$('#zoneDetails').empty();
	$("#dashboardLoading").show();
	$.ajax({
			url: baseURL + 'php/set_controller.php?controller_id=' + controller_id + '&json=true',
			dataType: 'json',
			success: function(data) {
				var title;
				title = "Controller: " + data.name;
				if( data.organisation ) {
					title += ' [' + data.organisation + ']';
				}
				$('.statusSummary').removeClass("controllerSelected");
				$('#controllerSummary-' + data.controller_id).addClass("controllerSelected");
				$('#current_controller').html(data.name);
				fnCallback();
			},
			error: function() {
			}
	});
}

function refreshLocation()
{
	$('#mapContainer').hide();
	$.getJSON(baseURL + 'php/get_customer_details.php?type=location', function(results){
		if( results.error_msg ) {
			redirect(results.error_msg);
		} else {
			if( results.address_1 ) {
				$('#address_1').val(results.address_1);
				originalAddress = results.address_1;
		    	updateMap();	
			} else {
		    	$('#addressInfoMsg').html("Please enter your controller's full address and click <i>Update Address</i>");
				$('#addressInfo').show();	
			}
	    }
	});
}

function refreshFlow()
{
	$('#tbl_flowsensor').dataTable().fnReloadAjax();
	$('#tbl_flowsensor_alert').dataTable().fnReloadAjax();	
}

function refreshZones()
{
	// refresh these tables
	$('#tbl_category').dataTable().fnReloadAjax();
	$('#tblwatersettings').dataTable().fnReloadAjax();
	$('#relays').dataTable().fnReloadAjax();
	$.getJSON(baseURL + 'php/get_customer_details.php?type=master_relay', function(results){
		if( results.error_msg) {
			redirect(results.error_msg);
		} else {
			$('#master_relay').html(results.relay_number);
		}
	});
}

function refreshReports()
{
	updateChart('','');
	$('#tbl_reports').dataTable().fnReloadAjax();
}

function refreshControllers(fnCallback)
{
	$.ajax({
		url: baseURL + 'php/get_customer_details.php?type=controllers',
		dataType: 'json',
		error: function(data) {
			setAlert("Error", "error", "Unable to connect to HydraWise. Please check your internet connection is active. <span style='cursor:pointer' class='label label-warning' onclick='refreshDashboard()'><i class='icon icon-refresh></i> Retry</span>", false);
		},
		success: function(data) {
			if( data.controllers != null ) {
				var appendString = "";
				var title;
				for( var index in data.controllers) {
					appendString += "<div id='controllerSummary-" + data.controllers[index].controller_id + "' class='statusSummary' onClick='changeActiveController(" + fnCallback + ","  + data.controllers[index].controller_id + ")'";
					if( data.controllers[index].organisation ) {
						title = "Customer: " + data.controllers[index].organisation;
					} else {
						title = "";
					}
					appendString += ">";
					appendString += "<a href='#'>";
					appendString += "<img src=" + imageRoot + data.controllers[index].status_icon + " title='" + title + "' style='border: none;'/>";
					appendString += "</a>";
					appendString += "<div class='smallValue'>" + data.controllers[index].status + "</div>";
					appendString += "<div>" + data.controllers[index].name + "</div>";
					appendString += "</div>";	
				}
				$('.controllerSummary').html(appendString);
				$('#current_controller').html(data.current_controller);
				$('#controllerSummary-' + data.controller_id).addClass("controllerSelected");
				$('#controller_change').show();
			}
		}
	});
}

var allHTML = null, runHTML = null, cancelHTML = null;

function modifySchedule(button) 
{		
	var params  = button.id.split("-");
	switch(params[0]) {
		case 'stopall':
		case 'stop':
			var urlString;
			if( params[0] == 'stop' ) {
				urlString = 'php/set_manual_data.php?action=stop&relay_id=' + params[1];
			} else {
				// stop all
				urlString = 'php/set_manual_data.php?action=stopall';
			}

			$.ajax({
  				url: baseURL + urlString,
  				dataType: 'json',
  				success: function(result) {
					setAlert('Stop station', result.message_type, result.message, false);
					refreshDashboard();
    			}
			});
			
			if( params[0] == 'stop' ) {
				$('#' + button.id).hide();
				$('#run-' + params[1]).show();
			}
			break;
		case 'runall':
		case 'run':
			if( runHTML == null ) {
				$.ajax({
	  				url: baseURL + 'php/get_select_json.php?table=tbl_runtimes&field=text',
	  				dataType: 'json',
	  				success: function(result) {
	  					runHTML = createSelectHTML(result);
						$("select#modifyTime").html(runHTML);
						$("#customTime").hide();
	    			},
					error: function() {
						setAlert("Info", "error", "Request timed out. Please check your internet access and try again.", false);
					}
				});
			} else {
				$("select#modifyTime").html(runHTML);
				$("#customTime").hide();
			}
			if( params[0] == 'runall' ) {
				$('#zoneName').html(" all zones ");
			} else {
				$('#zoneName').html(" " + $('#name-' + params[1]).html() + " ");
			}
			$('#modifyAction').html("run");
			$('#modify-dialog').modal("show");
			$('#modify-icon').attr('src', imageRoot + 'play.png');
			break;
		case 'suspendall':
		case 'suspend':
			if( cancelHTML == null ) {
				$.ajax({
	  				url: baseURL + 'php/get_select_json.php?table=tbl_canceltimes&field=text',
	  				dataType: 'json',
	  				success: function(result) {
		  				cancelHTML = createSelectHTML(result);
						$("select#modifyTime").html(cancelHTML);
						$("#customTime").hide();
	    			},
					error: function() {
						setAlert("Info", "error", "Request timed out. Please check your internet access and try again.", false);
					}
				});
			} else {
				$("select#modifyTime").html(cancelHTML);
				$("#customTime").hide();
			}
			$('#modify-dialog').modal("show");
			if( params[0] == 'suspendall' ) {
				$('#zoneName').html(" all zones ");
			} else {
				$('#zoneName').html( " " + $('#name-' + params[1]).html() + " " );
			}
			$('#modifyAction').html("suspend");
			$('#modify-icon').attr('src', imageRoot + 'pause.png');
			break;
	}
	$('#action').val(params[0]);
	$('#zoneNumber').val(params[1]);
}

var alertTimer;

function setAlert(title, class_type, alert, keep, time) {
	time = typeof time === 'undefined' ? 10000 : time * 1000;
	switch(class_type) {
		case 'error':
			class_type = 'label-important';
			break;
		case 'info':
			class_type = 'label-info';
			break;
		default:
			class_type = '';
			break;
	}
	$("#alert_message_title").attr("class","label " + class_type);
	$("#alert_message_title").html(title);
	$("#alert_message").html(alert);
	$("#info-alerts").show();
    
    clearInterval(alertTimer);
	alertTimer = window.setTimeout(function() {
	    $("#info-alerts").slideUp(500, function(){
	        $(this).hide(); 
	    });
	}, time);	
}

function refreshWizard() {
	window.location = baseURL + 'config/dashboard.php';
}

var scheduleDetails = new Object;

function updatePopover(relay_id, my_object) {
	var object = $(my_object);
	$("#message-" + relay_id, object).html(scheduleDetails[relay_id].message);

	$("#nicetime-" + relay_id, object).html(scheduleDetails[relay_id].nicetime);

	$("#runlength-" + relay_id, object).html(scheduleDetails[relay_id].run);
	$("#lastwater-" + relay_id, object).html(scheduleDetails[relay_id].lastwater);
	$("#relayno-" + relay_id, object).html(relay_id);

	if( scheduleDetails[relay_id].message.length ) {
		$("#message_divider-" + relay_id, object).show();
		$("#message-" + relay_id, object).show();
	} else {
		$("#message_divider-" + relay_id, object).hide();
		$("#message-" + relay_id, object).hide();
	}
	$("#message-" + relay_id, object).html(scheduleDetails[relay_id].message);

	if( scheduleDetails[relay_id].suspended ) {
		$('#pic-' + relay_id, object).addClass('transparent');
	} else {
		$('#pic-' + relay_id, object).removeClass('transparent');		
	}

	if( scheduleDetails[relay_id].message1.length ) {
		$("#message1-" + relay_id, object).show();
	}
	$("#message1-" + relay_id, object).html(scheduleDetails[relay_id].message1);

	if( scheduleDetails[relay_id].running == true ) {
		$('#run-' + relay_id, object).hide();
		$('#stop-' + relay_id, object).show();
	} else {
		$('#run-' + relay_id, object).show();
		$('#stop-' + relay_id, object).hide();
	}
	return object; 
}

function get_popover_placement(dom_el) {
	var width = $(window).innerWidth();

	var left_pos = $(dom_el).offset().left;

	if (width - left_pos > 400) return 'right';

	if (width<500) return 'bottom';

	return 'left';
}

var dashboardTimer;

function retryRefreshDashboard()
{
    clearInterval(dashboardTimer);
	setAlert("Info", "info", "<i class='icon-spinner icon-spin'></i> Refreshing...", false, 2);
	refreshDashboard();
}

function refreshDashboard() {
    $("#dashboardRefreshing").show();
	$.ajax({
			url: baseURL + 'php/get_sched_json.php?hours=192',
			dataType: 'json',
			error: function(data) {
                $("#dashboardRefreshing").hide();
				$("#dashboardLoading").hide();
				setAlert("Error", "error", "Unable to connect to HydraWise. Please check your internet connection is active. <span style='cursor:pointer' onclick='retryRefreshDashboard()'><i class='icon-refresh'></i> Retry</span>", false, 600);
				clearInterval(dashboardTimer);
				dashboardTimer = setTimeout(function() {
					refreshDashboard();
				}, 60000);
			},
			success: function(data) {
                $("#dashboardRefreshing").hide();
				$("#dashboardLoading").hide();
				if( data.error_msg ) {
					redirect(data.error_msg);
				} else {
					if( data.redirect ) {
						window.location = data.redirect;
						return;
					}

					if( data.password_reset == 1 ) {
						$( "#password-dialog" ).modal("show");
					}

					if( data.system_message ) {
						$('#system-alerts').show();
						$('#system_message').html(data.system_message);
					} else {
						$('#system-alerts').hide();						
					}

					if( data.trial ) {
						scheduleDetails.trial = true;
						$('#associate').show();
						$('#associate_divider').show();
						$('#last_contact').hide();
					} else {
						scheduleDetails.trial = false;
						$('#associate').hide();
						$('#associate_divider').hide();
						$('#last_contact').show();
					}

					if( data.relays.length > 0 ) {
						$("#relayError").hide();
						for (var circuit_no in data.relays) {
							scheduleDetails[data.relays[circuit_no].relay_id] = new Object;
							scheduleDetails[data.relays[circuit_no].relay_id].zone_name = data.relays[circuit_no].name;
		
							if( data.relays[circuit_no].message ) {
								scheduleDetails[data.relays[circuit_no].relay_id].message = data.relays[circuit_no].message;
							} else {
								scheduleDetails[data.relays[circuit_no].relay_id].message = '';
							}
							// next run time
							scheduleDetails[data.relays[circuit_no].relay_id].nicetime = data.relays[circuit_no].nicetime;
																					
							// length
							scheduleDetails[data.relays[circuit_no].relay_id].run = data.relays[circuit_no].run;

							// next water
							scheduleDetails[data.relays[circuit_no].relay_id].lastwater = data.relays[circuit_no].lastwater;
								
							scheduleDetails[data.relays[circuit_no].relay_id].running = false;
							scheduleDetails[data.relays[circuit_no].relay_id].message1 = '';

							if( document.getElementById('summary-' + data.relays[circuit_no].relay_id) == null ) {
								var station_details = createZone(data.relays[circuit_no].relay_id, data.relays[circuit_no].name, imageRoot + data.relays[circuit_no].icon);
								$('#zoneDetails').append(station_details);
								$('#pic-' + data.relays[circuit_no].relay_id).clickover({
									trigger: 'click',
									html:true, 
									placement: get_popover_placement('#pic-' + data.relays[circuit_no].relay_id), 
									content: function() {
										var station_popover = "<div id='info-<station>'><div> \
												                <div class='smallInfoHeading hide' id='message-<station>'></div> \
												                <div class='smallInfoHeading hide' id='message1-<station>'></div> \
												               	<div class='divider hide' id='message_divider-<station>'></div> \
												                <div class='smallInfoHeading'><b class='pull-left'>Next Run</b> \
												                	<a class='smallValue dashboard_schedule_show pull-right' id='nicetime-<station>'></a></div> \
												                <div class='smallInfoHeading'><b class='pull-left'>Length</b> \
												 	               <span class='smallValue pull-right' id='runlength-<station>'></span></div> \
												                <div class='smallInfoHeading'><b class='pull-left'>Last Water</b> \
												    	            <span class='smallValue pull-right' id='lastwater-<station>'></span></div> \
												    	        <div class='clearfix'></div> \
												    	        <i class='dashboardIconTip pull-left icon icon-2x icon-play-sign lightgreen' title='Run this station now' id='run-<station>' onClick='modifySchedule(this)'></i> \
												    	        <i class='dashboardIconTip pull-left icon icon-2x icon-stop red hide' title='Cancel this watering cycle' id='stop-<station>' onClick='modifySchedule(this)'></i> \
												    	        <i style='float:left; text-align: center' class='dashboardIconTip icon icon-2x icon-pause darkcyan' title='Suspend this station' id='suspend-<station>' onClick='modifySchedule(this)'></i> \
												    	        <i class='dashboardIconTip pull-right icon icon-2x icon-info-sign blue' title='Show this stations watering schedule' id='info-<station>' onClick='showWaterSchedule(this)'></i> \
												              </div></div>";
										var zone = this.id.split("-");
										var popover_details = station_popover.replace(/<station>/g, zone[1]);

										popover_details = updatePopover(zone[1], popover_details);
										return(popover_details);
									}
								});
							}
							
							if( data.relays[circuit_no].suspended != null ) {
								scheduleDetails[data.relays[circuit_no].relay_id].suspended = true;
								$('#pic-' + data.relays[circuit_no].relay_id).addClass('transparent');
							} else {
								$('#pic-' + data.relays[circuit_no].relay_id).removeClass('transparent');
								scheduleDetails[data.relays[circuit_no].relay_id].suspended = false;
							}

						}

						if( data.running != null ) {
							for (var circuit_no in data.running) {
								scheduleDetails[data.running[circuit_no].relay_id].running = true;
								scheduleDetails[data.running[circuit_no].relay_id].message = data.running[circuit_no].run + " remaining";

								if( data.running[circuit_no].water ) {
									scheduleDetails[data.running[circuit_no].relay_id].water = data.running[circuit_no].water;
									scheduleDetails[data.running[circuit_no].relay_id].message1 = "Zone has used " + data.running[circuit_no].water;
								}
							}
						}			

						for (var circuit_no in data.relays) {
							$("#name-" + data.relays[circuit_no].relay_id).html(scheduleDetails[data.relays[circuit_no].relay_id].zone_name);
							if( scheduleDetails[data.relays[circuit_no].relay_id].running == true ) {
								$('#pic-' + data.relays[circuit_no].relay_id).attr('src', imageRoot + 'spray_on.gif');
							}  else {
								$('#pic-' + data.relays[circuit_no].relay_id).attr('src', imageRoot + data.relays[circuit_no].icon);
							}
							var updated_content;
							var content = $('#info-' + data.relays[circuit_no].relay_id).html();
							updated_content = updatePopover(data.relays[circuit_no].relay_id, content);
							$('#info-' + data.relays[circuit_no].relay_id).html(updated_content);
						}
					} else {
						$("#relayError").show(0);
					}
					// set current observations
					$("#observation_rain").html(data.obs_rain);
					$("#observation_rain_week").html(data.obs_rain_week);
					$("#observation_maxtemp").html(data.obs_maxtemp);
					$("#observation_currenttemp").html(data.obs_currenttemp);
	
					$("#lastContact").html(data.last_contact);

					$("#statusText").html(data.status);
					$("#statusIcon").attr('src', imageRoot + data.status_icon);
	
					$("#wateringTime").html(data.watering_time);
					$("#waterSaving").html(data.water_saving + '%');
					if( data.water_saving < 0 ) {
						$("#waterSaving").css("color","red");
					} else {
						$("#waterSaving").css("color","green");
					}
						
					// set controller's name in title bar	
					$("#controllerName").html(' ' + data.name);
					
					// set forecast
					if( data.forecast ) {
						if( data.forecast.msg ) {
							$("#forecast-day-0").html(data.forecast.msg);
						} else {
							for (var forecast_day in data.forecast) {
								$("#forecast-day-"+forecast_day).html(data.forecast[forecast_day].day);
								$("#forecast-temp-"+forecast_day).html(data.forecast[forecast_day].temp_hi);
								$("#forecast-conditions-"+forecast_day).html(data.forecast[forecast_day].conditions);
								if( data.forecast[forecast_day].pop ) {
									$(".rain-chance").show();
									$("#forecast-pop-"+forecast_day).html(data.forecast[forecast_day].pop);
								}
								$("#forecast-icon-"+forecast_day).attr('src', data.forecast[forecast_day].icon_local);
							}
						}

					tour.start(true);

					clearInterval(dashboardTimer);
					dashboardTimer = setTimeout(function() {
						refreshDashboard();
					}, data.nextpoll ? data.nextpoll*1000 : 60000);
				}	
			}
		}
	});
}

// go through and create all the zones (hidden)
function createZone(id, name, pic)
{

	var station_details = station.replace(/<station>/g, id);
	station_details = station_details.replace(/<pic>/g, pic);

	return station_details;
}

function cancelManual(action, relay)
{
	var dataString = 'action=' + action + '&relay_id=' + relay + '&period_id=7';
	$.ajax(
		{
		url: baseURL + 'php/set_manual_data.php',
		cache: false,
		dataType: "json",
		data: dataString,
		success: function(response) {
			setAlert('Schedule Change', response.message_type, response.message, false);
			if( response.refresh ) {
				for(var index in response.refresh) {
  					$('#' + response.refresh[index]).dataTable().fnReloadAjax();
				}
			}
		},
		error: function() {
			setAlert("Info", "error", "Something went wrong there. Please try again.", false);
		}
	});
}

function modifyScheduleOK()
{
	var action = $('#action').val();
	var dataString = 'action=' + action + '&relay_id='+$('#zoneNumber').val() + '&period_id=' + $('#modifyTime').val();
	
	if( $('#modifyTime').val() == 999 ) {
		dataString += '&custom=' + $('#customTimeSlider').val()*60;
	}
	
	$('#modify-dialog').modal("hide");
	$.ajax(
		{
		url: baseURL + 'php/set_manual_data.php',
		cache: false,
		dataType: "json",
		data: dataString,
		success: function(response) {
			setAlert('Schedule Change', response.message_type, response.message, false);
			refreshDashboard();
		},
		error: function() {
			setAlert("Info", "error", "Something went wrong there. Please try again.", false);
		}
	});
}
