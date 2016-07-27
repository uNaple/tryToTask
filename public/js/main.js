// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

	var allTasks 		= new Array(),//здесь хранятся задачи, потом редиска будет
			myTasks 		= new Array(),
			listStatus	= new Array(),
			listTypes 	= new Array(),
			listUsers 	= new Array();
	getExtra();

//======== Добавление задачи

	function getExtra() {
		console.log('getExtra func');
		if(checkExist(listUsers)) { //тут еще проверки на полноту типов и статусов, вообще статусы и типа и прочую статику надо вшить, либо один раз грузить, но отдельно от динамической инфы
			return true;
		} else {
			$.get('getExtra', function (result) {
				var arr = JSON.parse(result);
				for(var i in arr) {
					if(arr[i].hasOwnProperty('Users')) {
						listUsers = arr[i].Users;
						// for(var j in arr[i].Users) {
						// 	listUsers.push(new Object({id: j, text: arr[i].Users[j]}));
						// }
					}
					if(arr[i].hasOwnProperty('Types')) {
						listTypes = arr[i].Types;
					}
					if(arr[i].hasOwnProperty('Status')) {
						listStatus = arr[i].Status;
					}
				}
			})
		}
	};

	$('#buttonAddTask1').on('click', function(event) {
		$('#listTasks').prepend('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
		var task = {name: 'New Task1', director: '451'};
		showInfo(task);
	});

	$('#buttonAddTask2').on('click', function(event) {
		$('#listTasks').append('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
		var task = {name: 'New Task2', director: '456'};
		showInfo(task);
	});

	$('#buttonTaskAdd').click(function(event) {
		console.debug('task add click');
		var data = $('#panelTaskEdit [name]');
		var task = new Object();
		console.debug(data);
		for(var i = 0; i < data.length; i++) {
			if(data[i].name !== null) {
				// console.debug(data[i].name, $.trim($(data[i]).attr('data-in')));
				console.debug(data[i].name, $.trim($(data[i]).val()));
				if($.trim($(data[i]).val()) === '') {
					task[data[i].name] = null;
				} else {
					task[data[i].name] = $.trim($(data[i]).val());
				}
			}
		}
		console.debug(task);
		// event.preventDefault();
		// $.ajax({
		// 	url: 'addTask',
		// 	method: 'POST',
		// 	data: task,
		// 	success: function(result) {
		// 			result = JSON.parse(result);
		// 			alert(result)
		// 			console.debug(result);
		// 		}
		// });
	});

//вот эту ебалу свернуть в одну функцию, внутри которой и делать выборку по тому, что необходимо отобразить
	$('#buttonMyTasks').click(function() {
			console.debug('myTasks func');
			var params = 'director=' + encodeURIComponent(679); //тут id из сессии
			if(!checkExist(myTasks)) {
				xhr.open('GET', '/getTasks?' + params, true);
				xhr.send();
				xhr.onreadystatechange = function() {
					if(xhr.readyState != 4)	return;
					if(xhr.status != 200) {
						alert(xhr.status + ': ' + xhr.statusText);
					} else {
						myTasks = JSON.parse(xhr.responseText);
						console.debug('myTasks: ', myTasks);
						showAll(myTasks);
					}
				}
			} else {
				showAll(myTasks);
			}
	});

	$('#buttonAllTasks').click(function() {
		console.debug('allTasks func');
		var params = 'status != 7'; //тут id из сессии
		if(!checkExist(allTasks)) {
			xhr.open('GET', '/getTasks?' + params, true);
			xhr.send();
			xhr.onreadystatechange = function() {
				if(xhr.readyState != 4)	return;
				if(xhr.status != 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					allTasks = JSON.parse(xhr.responseText);
					console.debug('allTasks: ', allTasks);
					showAll(allTasks);
					// console.debug(JSON.parse(xhr.responseText));
				}
			}
		} else {
			showAll(allTasks);
		}
	});

	function showInfo(task) {
		console.debug('show info func');
		console.debug(task);
		for(var key in task) {
			if(key !== 'null') {
				if(key === 'name') {
					console.debug(task.name);
					$('#panelTaskEdit #taskName').val(task.name);
					// $('#panelTaskEdit #taskName').attr('data-in', task.name);
				}
				if(key === 'description') {
					$('#panelTaskEdit #taskDescription').val(task.description);
					// $('#panelTaskEdit #taskDescription').attr('data-in', task.description);
				}
				// if(key === 'director') {
				// 	// $('#panelTaskEdit #taskDirector').val(listUsers[task.director]);
				// 	// $('#panelTaskEdit #taskDirector').attr('data-in', listUsers[task.director]);
				// }
				// if(key === 'status') {
				// 	$('#panelTaskEdit #taskStatus').val(listStatus[task.status]);
				// 	// $('#panelTaskEdit #taskStatus').attr('data-in', listStatus[task.status]);
				// }
				// if(key === 'type') {
				// 	$('#panelTaskEdit #taskType').val(listTypes[task.type]);
				// 	// $('#panelTaskEdit #taskType').attr('data-in', listTypes[task.type]);
				// }
			}
		}
		$('#panelTaskEdit').show();
	};

//Отображение листа с задачами.
	function showAll(arr) {
		$('#listTasks').empty();
		for(var key in arr) {
			var elem = $('<li class="flexrow" style="" data-id="' + arr[key].id +'"><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[key].name + '</span></li>');
			$('#listTasks').append(elem);
			$('#taskDirector').select2();

			elem.click(function() {
				fillListUsers(arr[$(this).attr('data-id')].director);
				fillStaticLists(arr[$(this).attr('data-id')]);
				console.debug('click on task with id:', $(this).attr('data-id') );
				showInfo(arr[$(this).attr('data-id')]);
			})
		}
	};

	function fillListUsers(director) {
		$('#taskDirector').select2();
		$('#taskDirector').empty();
		for(var key in listUsers) {
			if(key === director.toString()) {
				$('#taskDirector').append('<option value="'+key+'" selected = "selected">'+ listUsers[key]+'</option>');
				continue;
			}
			$('#taskDirector').append('<option value="'+key+'">'+ listUsers[key]+'</option>');
		}
	};

	function fillStaticLists(task) {
		$('#taskType').select2();
		$('#taskStatus').select2();
		$('#taskType').empty();
		$('#taskStatus').empty();
		for(var key in listTypes) {
			if(key === task.type.toString()) {
				$('#taskType').append('<option value="'+key+'" selected = "selected">'+ listTypes[key]+'</option>');
				continue;
			}
			$('#taskType').append('<option value="'+ listTypes[key]+'">'+key+'</option>');
		}
		for(var key in listStatus) {
			if(key === task.status.toString()) {
				$('#taskStatus').append('<option value="'+key+'" selected = "selected">'+ listStatus[key]+'</option>');
				continue;
			}
			$('#taskStatus').append('<option value="'+ listStatus[key]+'">'+key+'</option>');
		}
	}

	function checkExist(obj) {//тут проверять вероятно будем из редиски
		for(var key in obj) {
			return true;
		}
		return false;
	};

})
