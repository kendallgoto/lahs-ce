var categoryArr = [];
var categoryWeight = [];
var categoryOutOf = []
var categoryPoints = []
var categorySum = 0;
var categoryOutOf_clone, categoryPoints_clone;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.addNewFaux == "1") {
		if(categoryArr.length == 0)
			refreshFauxGrade();
	}
	else if(request.addNewFaux == 0) {
		refreshFauxGrade();
	}
	if(request.fetchGrade == true) {
		sendResponse(fetchAlternates());
	}
});

function refreshFauxGrade() {
	categoryArr = [];
	categoryWeight = [];
	categoryOutOf = [];
	categoryPoints = [];
	categorySum = 0;
	//get categories
	var obj = $('#ctl00_MainContent_subGBS_DataSummary_ctl01_trSummary').parent(); //tbody containing all.
	$('tr[id^=ctl00_MainContent_subGBS_DataSummary]').not(':last-child').each(function() {
		categoryArr.push($('td', this).first().text());
		categoryWeight.push($('td', this).eq(1).text());
		categoryPoints.push($('td', this).eq(2).text());
		categoryOutOf.push($('td', this).eq(3).text());
	});
	
	//add our faux row
	var cloneit = $('.GradebookDetailsTable.ResultsTable > tbody > tr').last().clone();
	cloneit.appendTo($('.GradebookDetailsTable.ResultsTable > tbody'));
	$('td', cloneit).eq(0).text(parseInt($('td', cloneit).eq(0).text())+1);
	$('td', cloneit).eq(1).text("Faux Assignment").attr('contenteditable', 'true').addClass('fauxTitle');
	$('td', cloneit).eq(2).html("<select class=\"fauxCat\"></select>"); //the category
	var option = '';
	for (var i=0;i<categoryArr.length;i++){
	   option += '<option value="'+ categoryArr[i] + '">' + categoryArr[i] + '</option>';
	}
	$('.fauxCat', cloneit).append(option);
	
	$('td', cloneit).eq(3).css('text-align', 'center').html("<span class=\"fauxScored\"	contenteditable=\"true\">0</span> / <span class=\"fauxOf\" contenteditable=\"true\">0</span>"); //the score
	$('td', cloneit).eq(4).text("");
	$('td', cloneit).eq(5).addClass("fauxGrade").text("0%");
	$('td', cloneit).eq(6).text("");
	$('td', cloneit).eq(7).text("");
	$('td', cloneit).eq(8).text("");
	$('td', cloneit).eq(9).text("Faux");
	$('td', cloneit).eq(10).text("");
	$('.fauxScored', cloneit).blur(contentEditableChange);
	$('.fauxOf', cloneit).blur(contentEditableChange);
	$('.fauxScored', cloneit).on('keydown', function(e) {
		var key = e.keyCode || e.charCode;
		if(key == 13)
			$(this).blur();
	});
	$('.fauxOf', cloneit).on('keydown', function(e) {
		var key = e.keyCode || e.charCode;
		if(key == 13)
			$(this).blur();
	});
	$('.fauxCat', cloneit).change(contentEditableChange);
	cloneit.addClass('customGrade')
  $('html, body').animate({
      scrollTop: cloneit.offset().top
  }, 2000);
	
}
function contentEditableChange() {
	var par = $(this).closest('.customGrade');
	if(!isNaN(parseFloat(par.find('.fauxScored').text()) / parseFloat(par.find('.fauxOf').text())))
		par.find('.fauxGrade').text(((parseFloat(par.find('.fauxScored').text()) / parseFloat(par.find('.fauxOf').text())) * 100).toFixed(2) + "%");
	fetchAlternates();
}
function fetchAlternates() {
	//Predetermined + faux
	categorySum = 0;
	categoryOutOf_clone = categoryOutOf.slice(0);
	categoryPoints_clone = categoryPoints.slice(0);
	$('.customGrade').each(function() {
		var cat = $('.fauxCat', this).val();
		var indx = categoryArr.indexOf(cat);
		
		//add fake points
		var outOf = $('.fauxOf', this).text();
		var scored = $('.fauxScored', this).text();
		categoryPoints_clone[indx] = parseFloat(categoryPoints_clone[indx]) + parseFloat(scored);
		categoryOutOf_clone[indx] = parseFloat(categoryOutOf_clone[indx]) + parseFloat(outOf);
		
	});
	for(var i = 0; i < categoryArr.length; i++) {
		if(parseFloat(categoryOutOf_clone[i]) != 0) {
			categorySum += parseFloat(categoryWeight[i]);
		}
	}
	//recalculate using these.
	return calculate();
}

function calculate() {
	var result = [];
	var cont = 0;
	for (var i = 0; i < categoryArr.length; i++) {
		var grade = parseFloat(categoryPoints_clone[i]) / parseFloat(categoryOutOf_clone[i]);
		if(isNaN(grade))
			grade = 0;
		cont += parseFloat(categoryWeight[i]) * grade / 100;
		result.push({
			"name": categoryArr[i],
			"weight": categoryWeight[i],
			"points": parseFloat(categoryPoints_clone[i]),
			"of": parseFloat(categoryOutOf_clone[i]),
			"grade": grade,
			"relative": parseFloat(categoryWeight[i]) * grade / 100
		});
	}
	result.push({
		"name": "Overall",
		"grade": (cont / (categorySum / 100))
	});
	return result;
}