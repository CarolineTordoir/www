var serviceURL = "https://api.billi.be/mobile/";
var services;

$('#ServiceListPage').bind('pageinit', function(event) {
	getServiceList();
});

function getServiceList() {
	$.getJSON(serviceURL + 'getservices_i', function(data) {
		$('#serviceList li').remove();
		services = data.data;
		$.each(services, function(index, s) {
			$('#serviceList').append('<li><a href="internet_detail.html?id=' + s.id + '">' +
					'<img src="pics/' + s.regdate + '"/>' +
					'<h4>' + s.username + ' ' + s.password + '</h4>' +
					'<p>' + s.server + '</p>' +
					'<span class="ui-li-count">' + s.packageid + '</span></a></li>');
		});
		$('#serviceList').listview('refresh');
	});
}