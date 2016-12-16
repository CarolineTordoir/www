angular.module('starter.controllers', ['ngStorage', 'ionic', 'pascalprecht.translate', 'billi', 'percentCircle-directive'])

.controller('LogoutCtrl', function($scope, apiUrl, Serv, $state, $http, $ionicLoading, $localStorage) {

        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });
        var link = apiUrl+"logout";
        $http.get(link).then(function(res) {
            //console.log(res);
            $ionicLoading.hide();
            delete $localStorage.token;
            delete $localStorage.userid;
            delete $localStorage.username;
            delete $localStorage.billiuser;
            delete $localStorage.billipass;
            delete $localStorage.lang;

            $state.go('login');
        });
             $ionicLoading.hide();

    })
    .directive('toggle', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (attrs.toggle == "tooltip") {
                    $(element).tooltip();
                }
                if (attrs.toggle == "popover") {
                    $(element).popover();
                }
            }
        };
    })
    .directive("progressBar", ["$timeout", function($timeout) {
        return {
            restrict: "EA",
            scope: {
                total: '=total',
                complete: '=complete',
                barClass: '@barClass',
                completedClass: '=?'
            },
            transclude: true,
            link: function(scope, elem, attrs) {

                scope.label = attrs.label;
                scope.completeLabel = attrs.completeLabel;
                scope.showPercent = (attrs.showPercent) || false;
                scope.completedClass = (scope.completedClass) || 'progress-bar-danger';

                scope.$watch('complete', function() {

                    //change style at 100%
                    var progress = scope.complete / scope.total;
                    if (progress >= 1) {
                        $(elem).find('.progress-bar').addClass(scope.completedClass);
                    } else if (progress < 1) {
                        $(elem).find('.progress-bar').removeClass(scope.completedClass);
                    }

                });

            },
            template: "<span class='small'>{{total}} {{label}}</span>" +
                "<div class='progress'>" +
                "   <div class='progress-bar {{barClass}}' title='{{complete/total * 100 | number:0 }}%' style='width:{{complete/total * 100}}%;'>{{showPercent ? (complete/total*100) : complete | number:0}} {{completeLabel}}</div>" +
                "</div>"
        };
    }])
    .controller('loginCtrl', function($scope, apiUrl, $http, $state, $timeout, $stateParams, Serv, $ionicPopup, $timeout, $location, $localStorage, $ionicLoading, $translate, $ionicHistory) {

          $scope.curlang = $translate.use($localStorage.lang);
        $translate(['loginerror', 'error','tryagain']).then(function(translations) {
        var token = $localStorage.token;
        if (token === null) {

        } else {
			var userid = $localStorage.userid;
             var link = apiUrl+"getsession/"+userid+"/"+token;
            $http.get(link).then(function(res) {
               
				console.log(res);

                if (res.data.result == "true") {
                    $localStorage.lang = res.data.lang;
					$localStorage.userid = res.data.data.userid;
                    $state.go('side.dash');
                }

            });



        }
   $scope.resetpass = function() {

$state.go('side.forgotpw');

   }
        $scope.login = function() {
             $ionicLoading.show({
                template: 'Processing.....',
                duration: 6000,
                noBackdrop: true
                });
            Serv.login($scope.login).then(function(data) {
			console.log(data.data.result);

                if (data.data.result == 1) {
                    $scope.login = function(username, password) {
                       
                    };
                     $localStorage.token = data.data.token;
                     $localStorage.lang = data.data.lang;
                     $localStorage.userid = data.data.userid;
                     
                     $ionicLoading.hide();
					            $ionicLoading.hide(); 
$ionicHistory.nextViewOptions({
  disableBack: true
});	
                     $state.go('side.dash');
                


                }else if(data.data.result == 2){ 
                    $localStorage.phone = data.data.phone;
                    $ionicLoading.hide();
                    $state.go('side.smsconfirm');

                }else{


		
					 $timeout( function () {
                    $scope.popup2 = $ionicPopup.show({
                        template: data.data.msg,
                        title: translations.error,
                        scope: $scope,
                        buttons: [{
                            text: translations.tryagain,
							type: 'button-simson',
                            onTap: function(e) {
                                $scope.popup2.close();
                                $state.reload();
                            }
                        }]
                    });
				});
             
				}
           
        });
		}
    });
    })
	
.controller('ForogotPassCtrl', function($scope, apiUrl, $state, $http, $stateParams, $timeout, $cordovaDevice, $ionicLoading, $ionicPopup, $localStorage, $translate) {
 var phone = $localStorage.phone;
 $scope.curlang = $translate.use($localStorage.lang);
  $translate(['emailerror', 'error','tryagain']).then(function(translations) {
	  
 $scope.resetpassword = function(email) {
    $ionicLoading.show({
        template: 'Validating.....',
        duration: 6000,
        noBackdrop: true
    });

        var link = apiUrl+'resetpassword/';
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                email: email
            },
            success: function(data) {
                console.log(data);
                if(data.result == 2){
                    $ionicLoading.hide();
                     $timeout( function () {
                    $scope.popup6 = $ionicPopup.show({
                        template: translations.emailerror,
                        title: translations.error,
                        scope: $scope,
                        buttons: [{
                            text: translations.tryagain,
                            type: 'button-simson',
                            onTap: function(e) {
                                $scope.popup6.close();
                                $state.reload();
                            }
                        }]
                    });
                });


                   
                }else{

            $ionicLoading.hide();
			$localStorage.tempid = data.tempid;
			$state.go('side.validatetoken');
			
                }

                   
            }
        });

}
});
})

.controller('validatetokenCtrl', function($scope, apiUrl, $state, $http, $stateParams, $timeout, $cordovaDevice, $ionicLoading, $ionicPopup, $localStorage, $translate, $ionicHistory) {
 var userid = $localStorage.tempid;
 console.log(userid);
 $scope.curlang = $translate.use($localStorage.lang);
   $translate(['error101', 'error102', 'error']).then(function(translations) {
 $scope.verifytoken = function(user) {
	 if(device.uuid == null){

                var uuid = "browser"+device.version;
            }else{


                var uuid = device.uuid;
            }
            var name = device.platform;
            var version =device.version;
			
			
    $ionicLoading.show({
        template: 'Validating.....',
        duration: 6000,
        noBackdrop: true
    });

        var link = apiUrl+'changepass';
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                userid: userid,
				token: user.token,
				password1: user.password1,
				password2: user.password2,
				uuid: uuid,
				name: name,
				version: version
            },
            success: function(data) {
			console.log(data);
			if(data.result == "OK"){
			  $localStorage.token = data.token;
            $localStorage.lang = data.lang;
            $localStorage.userid = data.userid;
			delete $localStorage.tempid;
			delete $localStorage.billipass;
			
            $ionicLoading.hide(); 
$ionicHistory.nextViewOptions({
  disableBack: true
});			
			$state.go('side.dash'); 	
			}else{
			
			if(data.error_code == "101"){
				var err = translations.error101;
				
			}else if(data.error_code == "102"){
				
				var err = translations.error102;
				
			}
			 $ionicLoading.hide();   
                alert(translations.error+': '+err);
				
			$state.reload();   	
			}
          
			
                 
            },
            error: function(e) {
                $ionicLoading.hide();   
                alert('Error: Please close the app and reopen');
            }
        });

}

 
   });
 
 
})

.controller('SmsConfirmCtrl', function($scope, apiUrl, $state, $http, $stateParams, $cordovaDevice, $ionicLoading, $localStorage, $translate, $ionicHistory) {
 var phone = $localStorage.phone;
 $scope.phonenumber = phone;
 $scope.curlang = $translate.use($localStorage.lang);
  document.addEventListener("deviceready", onDeviceReady, false);


   

        function onDeviceReady() {
            var push = PushNotification.init({
                "android": {
                    "senderID": "124177596832"
                }
            });
            var uuid =$cordovaDevice.getUUID();
               push.on('registration', function(data) {

               var data = $.param({
                registerid: data.registrationId,
                uuid: uuid
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post(apiUrl+'pushregister', data, config)
            .success(function (data, status, headers, config) {

            })

});

    };
 $scope.validateme = function(code) {
    $ionicLoading.show({
        template: 'Validating.....',
        duration: 6000,
        noBackdrop: true
    });

        var link = apiUrl+'validateme/'+phone+'/'+code;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                code: code,
                number: phone
            },
            success: function(data) {
            $localStorage.token = data.token;
            $localStorage.lang = data.lang;
            $localStorage.userid = data.userid;
            $ionicLoading.hide();  
$ionicHistory.nextViewOptions({
  disableBack: true
});	





            $state.go('side.dash');        
            },
            error: function(e) {
                $ionicLoading.hide();   
                alert('Error: Please close the app and reopen');
            }
        });

}


})
.controller('OpenTicketCtrl', function($scope, apiUrl, Serv, $location, $http, $ionicLoading, $timeout, $ionicPopup, $localStorage, $translate) {
    $scope.curlang = $translate.use($localStorage.lang);

     $translate(['ticketcreated', 'ticketerror','ticketcreatedid','ticketnotcreated']).then(function(translations) {


    var link = apiUrl+'getdept';

    
    var token = $localStorage.token;
    $scope.loading = true;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "json",
        data: {
           token: token
        },
        success: function(i) {
            //console.log(i);
            $ionicLoading.hide();
            $scope.data = i;
            $scope.defaultSelectedVAT = i.dept[1].id;
        },
        error: function(e) {
            alert('Error: ' + e.message);
        }
    });
    $scope.submiticket = function(submiticket) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });
        var url = apiUrl+"submitticket";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: {
                did: submiticket.did,
                message: submiticket.message,
                title: submiticket.title
            },
            success: function(i) {
                //console.log(i);
                $ionicLoading.hide();
                if (i.result == "success") {
					 $timeout( function () {
                    $scope.popup3 = $ionicPopup.show({
                        title: translations.ticketcreated,
                        template: translations.ticketcreatedid+" "+ i.tid,
                        scope: $scope,
                        buttons: [{
                            text: 'OK',
							type: 'button-simson',
                            onTap: function(e) {
                                $scope.popup3.close();
                                $location.path('/side/viewticket/' + i.id);
                            }
                        }]
                    });

					 });


                } else {

                    $ionicLoading.hide();
					 $timeout( function () {
                    $scope.popup4 = $ionicPopup.show({
                        title: translations.ticketerror,
                        template: translations.ticketnotcreated,
                        scope: $scope,
                        buttons: [{
                            text: 'OK',
							type: 'button-simson',
                            onTap: function(e) {
                                $scope.popup4.close();
                                $location.path('/side/tickets');
                            }
                        }]
                    });
  });
                }

            },
            error: function(e) {


            }
        });


    };
     });
})

.controller('AddmoneyCtrl', function($scope, apiUrl, Serv, $state, $localStorage, $ionicLoading, $translate) {

    $scope.curlang = $translate.use($localStorage.lang);


})

.controller('DashCtrl', function($scope, apiUrl, Serv, $state, $localStorage, $ionicLoading, $translate) {

    $scope.curlang = $translate.use($localStorage.lang);
	 $translate(['yourbalance']).then(function(translations) {
        $scope.addmoney = function(){
        $state.go('side.addmoney');

        };
    $ionicLoading.show({
        template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>',
        noBackdrop: true
    });

    
    var token = $localStorage.token;
    var billiuser = $localStorage.billiuser;
    console.log($localStorage);
    var link = apiUrl+'getdashboard';
    $scope.loading = true;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "json",
        data: {
        
            token: token
        },
        success: function(data) {
            console.log(data);
            if (data.stat.invoice > 0) {
                var style = "assertive";
            } else {
                var style = "balanced";
            }
            $ionicLoading.hide();
            $scope.data = data;
			if(data.client.client.credit > 0){
				 $('#balance').append('<div class="card">'+
               '<div class="item item-text-wrap"><div class="tengahin">'+
               translations.yourbalance+'<strong> &euro;'+data.client.client.credit+
                '</strong></div>'+
                '</div>'+
                '</div>	');
			}else{
				$('#balance').append('<div class="card">'+
               '<div class="item item-text-wrap"><div class="tengahin">'+
               translations.yourbalance+'<strong> &euro;0.00'+
                '</strong></div>'+
                '</div>'+
                '</div>	');
			}
            if(data.stat.pendingorders > 0){

           $('#pendingorder').append('<div class="card bar-balanced">'+
                '<div class="item item-text-wrap tengah">'+
               '<a href="/#/side/pendingorder">You have '+data.stat.pendingorders+' pending order(s) in order to see or to complete this order please tap here'+
              '</strong></div>'+
                '</div>');



            }
        },
        error: function(e) {
              $ionicLoading.hide();
            alert('Error: ' + e.message);
        }
    });

 });

})


.controller('InternetCtrl', function($scope, apiUrl, Serv, $localStorage, $ionicLoading, $translate) {

    $scope.curlang = $translate.use($localStorage.lang);

    $translate(['recurring', 'status', 'show_details']).then(function(translations) {

        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });
        
        var token = $localStorage.token;
        var link = apiUrl+'getservices_i';
        $scope.loading = true;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                token: token
            },
            success: function(data) {
                $ionicLoading.hide();
                $.each(data.data, function(i, item) {
                    var orderid = item.orderid;
                    var amount = item.amount;
                    var status = item.domainstatus;
                    var regdate = item.regdate;
                    var name = item.name;
                    var image = item.image;
                    if (image.length == 0) {
                        var image = "internet-xxl.png";
                    }
                    var d = regdate;
                    d = d.substr(0, 10).split("-");
                    d = d[2] + "/" + d[1] + "/" + d[0];
                    $('#Service-List').append('<div class="item item-thumbnail-left"><img src="img/' + image + '" width="35"><h2>' + name + '</h2><p>' + d + '</p></div>' +
                        '<div class="item item-body"><div class="list"><div class="list">' + translations.status + ': ' + status + '<br />' + translations.recurring + ': ' + amount + '</div><a class="button ion-unlocked button-block button-simson" href="#/side/internetdetail/' + orderid + '"> ' + translations.show_details + ' </button></div></div>');
                });
                $('#spin').hide();
            },
            error: function(e) {
                alert('Error: ' + e.message);
            }
        });
    });
})

.controller('InternetDetailsCtrl', function($scope, apiUrl, $http, $state, $stateParams, $localStorage, Serv, $ionicLoading, $compile, $ionicModal, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        $translate(['changingkey', 'status', 'recurring','package','save','close','wifissid','wifikey','profile','changewifikey','hardware','changewifissid','modemserial','lineid','modem','username','password','location','orderdate', 'orderid', 'status', 'addonname', 'cycle']).then(function(translations) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });

        $scope.data = {};
        var id = $stateParams.id;
        var link = apiUrl+'getinternet/' + id;

        $scope.mobilechangessid = function(ssid) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
            var linking = apiUrl+'mobilechangessid';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    orderid: id,
                    ssid: ssid
                },
                success: function(data) {
                    $ionicLoading.hide();
                    ////console.log(data);
                    $scope.modalssid.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
        $scope.mobilechangekey = function(key) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized">'+translations.changingkey+'</ion-spinner>'
            });
            var linking = apiUrl+'mobilechangekey';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    orderid: id,
                    passkey: key
                },
                success: function(data) {
                    $ionicLoading.hide();
                    //console.log(data);
                    $scope.modalpasskey.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
        $http.get(link).then(function(res) {
            $ionicLoading.hide();
            var i = res.data;
            ////console.log(i);
            $('#ServiceDetail').append('<div class="card list">' +
                '<div class="item item-divider">'+translations.package+': ' + i.hosting.name + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">'+translations.recurring+'</div>' +
                '<div class = "col kanan">&euro;' + i.hosting.amount + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.orderdate+'</div>' +
                '<div class = "col kanan">' + i.hosting.regdate + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.orderid+'</div>' +
                '<div class = "col kanan">' + i.hosting.orderid + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.lineid+'#</div>' +
                '<div class = "col kanan">' + i.hosting.domain + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.status+'</div>' +
                '<div class = "col hijau">' + i.hosting.domainstatus + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.modem+'</div>' +
                '<div class = "col kanan">' + i.hosting.serial + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.username+'</div>' +
                '<div class = "col kanan">' + i.hosting.username + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.password+'</div>' +
                '<div class = "col kanan">' + i.hosting.password + '</div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider">'+translations.location+': ' + i.hosting.address + '</div>' +
                '</div>');

            if (i.addons.length > 0) {
                ////console.log(i.addons);
                $.each(i.addons, function(i, item) {
                    $('#addons').append('<div class="card list">' +
                        '<div class="item item-divider">'+translations.addonname+': ' + item.name + '</div>' +
                        '<div class="item item-text-wrap">' +
                        '<div class = "row">' +
                        '<div class = "col">'+translations.recurring+'</div>' +
                        '<div class = "col kanan">&euro;' + item.recurring + '</div>' +
                        '</div>' +
                        '<div class = "row">' +
                        '<div class = "col">'+translations.cycle+'</div>' +
                        '<div class = "col kanan">&euro;' + item.billingcycle + '</div>' +
                        '</div>' +

                        '</div>' +

                        '<div class="item item-divider">'+translations.status+': ' + item.status + '</div>' +
                        '</div>');



                });
            }
            if (i.modem.status == "ONLINE") {

                var modem_style = "hijau";
            } else {
                var modem_style = "merah";
            }

            if (i.modem.passkey.length == 0) {

                var passkey = 'Unknown';
            } else {
                var passkey = i.modem.passkey;

            }
            $('#addons').append($compile('<div class="card list">' +
                '<div class="item item-divider">'+translations.modemserial+': ' + i.hosting.serial + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">IPv4</div>' +
                '<div class = "col kanan">' + i.modem.ip + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.status+'</div>' +
                '<div class = "col ' + modem_style + '">' + i.modem.status + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.profile+'</div>' +
                '<div class = "col kanan">' + i.modem.downstream + 'Mbps/' + i.modem.upstream + 'Mbps</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.wifissid+':</div>' +
                '<div id="ssidval" class = "col kanan"><a ng-click="openModalSSID(' + i.hosting.orderid + ')">' + i.modem.ssid + '</a></div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">'+translations.wifikey+':</div>' +
                '<div id="keyval" class = "col kanan"><a ng-click="openModalPASSKEY(' + i.hosting.orderid + ')">' + passkey + '</a></div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider">'+translations.hardware+': ' + i.modem.hardware + '</div>' +
                '</div>')($scope));



        });

        $scope.modalpasskey = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">'+translations.changewifikey+' </div><div class="col text-right"><button ng-click="closeModaPASSKEY()" class="button button-simson">'+translations.close+'</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

            ' <div class="list">' +

            '<div class="item item-input-inset">' +
            '<label class="item-input-wrapper">' +
            '<input ng-model="wifikey" type="text" value="{{wifikey}}">' +
            '</label>' +
            '<button ng-click="mobilechangekey(wifikey);" class="button button-small button-simson">' +
            '<i class="icon ion-social-buffer"></i> '+translations.save+' '+
            '</button>' +
            '</div>' +

            '</div>' +

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
        $scope.modalssid = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">'+translations.changewifissid+'</div><div class="col text-right"><button ng-click="closeModalSSID()" class="button button-simson">'+translations.close+'</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

            ' <div class="list">' +

            '<div class="item item-input-inset">' +
            '<label class="item-input-wrapper">' +
            '<input ng-model="ssid" type="text" value="{{ssid}}">' +
            '</label>' +
            '<button ng-click="mobilechangessid(ssid);" class="button button-small button-simson">' +
            '<i class="icon ion-social-buffer"></i> '+translations.save+' '+
            '</button>' +
            '</div>' +

            '</div>' +

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
        $scope.openModalPASSKEY = function(orderid) {

            $http.get(link).then(function(restu) {

                $scope.wifikey = restu.data.modem.passkey;
            });
            $scope.id = orderid;
            $scope.modalpasskey.show();
        };
        $scope.openModalSSID = function(orderid) {

            $http.get(link).then(function(res) {
                $scope.ssid = res.data.modem.ssid;
            });
            $scope.id = orderid;
            $scope.modalssid.show();
        };
        $scope.closeModaPASSKEY = function() {
            $scope.modalpasskey.hide();
        };
        $scope.closeModalSSID = function() {
            $scope.modalssid.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalssid.remove();
        });
        $scope.$on('$destroy', function() {
            $scope.modalpasskey.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
          });

    })
    .controller('MobileCtrl', function($scope, apiUrl, Serv, $localStorage, $ionicLoading, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        $translate(['status', 'recurring', 'show_details']).then(function(translations) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });

            var token = $localStorage.token;
            var link = apiUrl+'getservices_m';
            $scope.loading = true;
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                  
                    token: token
                },
                success: function(data) {
                    $ionicLoading.hide();
                    $.each(data.data, function(i, item) {
                        var orderid = item.orderid;
                        var mssidn = item.domain;
                        var amount = item.amount;
                        var image = item.image;
                        var status = item.domainstatus;
                        var regdate = item.regdate;
                        var name = item.name;
                        var d = regdate;
                        d = d.substr(0, 10).split("-");
                        d = d[2] + "/" + d[1] + "/" + d[0];
                        if (image.length == 0) {
                            var image = "mobile.png";
                        }
                        $('#Service-List').append('<div class="item item-thumbnail-left"><img src="img/' + image + '" width="30"><h2>' + name + ' </h2><i class="kanan">+' + mssidn + '</i><br /><i class="kanan">' + d + '</i></div>' +
                            '<div class="item item-body"><div class="list"><div class="list">' + translations.status + ': ' + status + '<br />' + translations.recurring + ': ' + amount + '</div><a class="button ion-unlocked button-block button-simson" href="#/side/mobiledetail/' + orderid + '"> ' + translations.show_details + '</button></div></div>');
                    });
                    $('#spin').hide();
                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });
        });

    })

.controller('MobileDetailsCtrl', function($scope, apiUrl, $http, $stateParams, Serv, $localStorage, $ionicLoading, $compile, $ionicModal, $translate) {
    $scope.curlang = $translate.use($localStorage.lang);
    $translate(['number', 'recurring', 'orderdate', 'orderid', 'status', 'addonname', 'cycle', 'nobar', 'partialbar', 'fullbar', 'siminfo']).then(function(translations) {

        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });
        
        //console.log(device);
        $scope.data = {};
        var id = $stateParams.id;
        var link = apiUrl+'getmobile/' + id;
        $scope.id = id;
        $http.get(link).then(function(res) {
            $ionicLoading.hide();
            var i = res.data;
            ////console.log(i);

            var d = i.hosting.regdate;
            d = d.substr(0, 10).split("-");
            d = d[2] + "/" + d[1] + "/" + d[0];
            $('#ServiceDetail').append('<div class="card list">' +
                '<div class="item item-divider">Package: ' + i.hosting.name + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">' + translations.number + ':</div>' +
                '<div class = "col kanan">' + i.hosting.domain + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">' + translations.recurring + '</div>' +
                '<div class = "col kanan">&euro;' + i.hosting.amount + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">' + translations.orderdate + '</div>' +
                '<div class = "col kanan">' + d + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">' + translations.orderid + '</div>' +
                '<div class = "col kanan">' + i.hosting.orderid + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">' + translations.status + '</div>' +
                '<div class = "col hijau">' + i.hosting.domainstatus + '</div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider"></div>' +
                '</div>');

            if (i.addons.length > 0) {
                ////console.log(i.addons);
                $.each(i.addons, function(i, item) {
                    $('#addons').append('<div class="card list">' +
                        '<div class="item item-divider">' + translations.addonname + ': ' + item.name + '</div>' +
                        '<div class="item item-text-wrap">' +
                        '<div class = "row">' +
                        '<div class = "col">' + translations.recurring + '</div>' +
                        '<div class = "col kanan">&euro;' + item.recurring + '</div>' +
                        '</div>' +
                        '<div class = "row">' +
                        '<div class = "col">' + translations.cycle + '</div>' +
                        '<div class = "col kanan">&euro;' + item.billingcycle + '</div>' +
                        '</div>' +

                        '</div>' +

                        '<div class="item item-divider">' + translations.status + ': ' + item.status + '</div>' +
                        '</div>');



                });
            }

            $('#addons').append($compile('<div class="card list">' +
                '<div class="item item-divider">' + translations.siminfo + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">PIN</div>' +
                '<div class = "col kanan">1111</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">PUK1</div>' +
                '<div class = "col kanan">' + i.hosting.puk1 + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">PUK2</div>' +
                '<div class = "col kanan">' + i.hosting.puk2 + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">SIM</div>' +
                '<div class = "col kanan">' + i.hosting.sim_number + '</div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider"></div>' +
                '</div>')($scope));
            var link2 = apiUrl+'mobile_getparameter/' + id;

            $http.get(link2).then(function(restu) {
                if (restu.data.bar == "0") {

                    $scope.bar = translations.nobar;

                } else if (restu.data.bar == "1") {

                    $scope.bar = translations.partialbar;
                } else if (restu.data.bar == "2") {

                    $scope.bar = translations.fullbar;
                }
                if (i.hosting.domainstatus == "Active" && restu.data.bar != "0") {

                    $scope.productstatus = 2;

                } else if (i.hosting.domainstatus == "Active") {

                    $scope.productstatus = 1;

                }
                $scope.bootstrap = true;
                param = restu.data.vars;
                $scope.number = restu.data.number;
                $scope.pushNotificationChange = function(data) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
                    });
                    var str = data.split(':');
                    var paramid = str[0];
                    if (str[1] == "true") {
                        var value = 1;
                    } else {
                        var value = 0;

                    }
                    ////console.log(id + ' ' + value + ' ' + paramid);
                    $.ajax({
                        type: "POST",
                        url: apiUrl+'setoption',
                        dataType: "json",
                        data: {
                            orderid: id,
                            id: paramid,
                            val: value
                        },
                        success: function(data) {
                            $ionicLoading.hide();
                            ////console.log(data);

                        },
                        error: function(e) {
                            alert('Error: ' + e.message);
                        }
                    });

                };

                $scope.pushNotification_mms = {
                    checked: param.mms.val,
                    id: param.mms.id
                };
                $scope.pushNotification_web = {
                    checked: param.web.val,
                    id: param.web.id
                };
                $scope.pushNotification_international = {
                    checked: param.international.val,
                    id: param.international.id
                };
                $scope.pushNotification_roaming = {
                    checked: param.roaming.val,
                    id: param.roaming.id
                };
                $scope.pushNotification_premium = {
                    checked: param.premium.val,
                    id: param.premium.id
                };
                $scope.pushNotification_lte = {
                    checked: param.lte.val,
                    id: param.lte.id
                };
            });

        });
    });



})

.controller('MobileCdrCtrl', function($scope, apiUrl, $http, $stateParams, Serv, $ionicLoading, $localStorage, $compile, $ionicModal, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        var id = $stateParams.id;
        $scope.data = {};
        $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
        });
        var date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

        $scope.firstDay = moment(firstDay).format('DD/MM/YYYY');
        $scope.lastDay = moment(lastDay).format('DD/MM/YYYY');



        var linkcdr = apiUrl+'getcurrentusage/' + id;
        $http.get(linkcdr).then(function(usg) {
            $ionicLoading.hide();
            $scope.number = usg.data.number;
            var sms = usg.data.sms;
            var internet = Math.round(usg.data.internet / 1048576);
            var voice = Math.round(usg.data.voice / 60);
            var bundlesms = usg.data.bundle.sms;
            var bundlevoice = usg.data.bundle.call / 60;
            var bundleinternet = usg.data.bundle.internet / 1048576;

            $scope.psms = sms / bundlesms * 100;
            $scope.pvoice = voice / bundlevoice * 100;
            $scope.pinternet = internet / bundleinternet * 100;

            $scope.bundle = usg.data.bundle;
            $scope.val1 = sms;
            $scope.val2 = voice;
            $scope.val3 = internet;


        });

    })
    .controller('TVCtrl', function($scope, apiUrl, $http, $translate, $localStorage) {
        $scope.curlang = $translate.use($localStorage.lang);

        $scope.data = {};
        var link = apiUrl+'getservices_t/';

        $http.post(link, {
            username: $scope.data.username
        }).then(function(res) {
            $scope.response = res.data;
        });

    })
    .controller('VoipCtrl', function($scope, apiUrl, $http, $translate, $localStorage) {
        $scope.curlang = $translate.use($localStorage.lang);
		 $translate(['number', 'recurring', 'orderdate']).then(function(translations) {

		var userid = $localStorage.userid;
        var voip = apiUrl+'getvoip/' + userid;
        $http.get(voip).then(function(v) {
		console.log(v.data);
		if(v.data.voipdata != null){
			      $.each(v.data.voipdata, function(i, item) {
                    
                           var style = "simson";
                            $('#Number').append('<div class="card">' +
                                '<div class="item item-divider-clear">' + translations.number + ': ' + item.number + '</div>' +
                                '<div class="item item-text-wrap">' +
                                '<div class = "row">' +
                                '<div class = "col">Product</div>' +
                                '<div class = "col kanan">'+item.product+'</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">Line cid</div>' +
                                '<div class = "col kanan">'+item.cid+'</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/voipview/'+item.number+'"><i class="icon ion-code-download"></i> View Usage </a> </div></div>');

                

                    });
					
					
			}
		
		});
		 });
			
	    })
		
		.controller('VoipViewCtrl', function($scope, apiUrl, $http, $translate, $ionicLoading, $stateParams, $localStorage) {
         $scope.curlang = $translate.use($localStorage.lang);
		 $translate(['number', 'recurring', 'orderdate']).then(function(translations) {
        var number = $stateParams.id;
		var userid = $localStorage.userid;
        var voip = apiUrl+'getvoipusage/' +number;
        $http.get(voip).then(function(usg) {
		$scope.usg = usg.data.cdr;
		$scope.total  = usg.data.cdr.int+usg.data.cdr.local;
		

		
		 });
		 });	
	    })
		
		
    .controller('InvoiceCtrl', function($scope, apiUrl, $stateParams, Serv, $http, $localStorage, $ionicLoading, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        $translate(['date', 'duedate', 'paid', 'unpaid', 'status', 'invoiceno', 'download', 'reference', 'amount', 'payonline']).then(function(translations) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
          
            $scope.data = {};
            var token = $localStorage.token;
            var link = apiUrl+'getinvoices/' + token;

            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                        token: token
                },
                success: function(data) {
                    $ionicLoading.hide();
                    $.each(data, function(i, item) {
                        var invoiceid = item.id;
                        var invoicenum = item.invoicenum;
                        var total = item.total;
                        var status = item.status;
                        var date = item.date;
                        var duedate = item.duedate;
                        var paymentmethod = item.paymentmethod;
                        var notes = item.notes;
                        var d = date;
                        d = d.substr(0, 10).split("-");
                        d = d[2] + "/" + d[1] + "/" + d[0];
                        var dd = duedate;
                        dd = dd.substr(0, 10).split("-");
                        dd = dd[2] + "/" + dd[1] + "/" + dd[0];
                        if (status == "Paid") {

                            var style = "simson";
                            $('#Invoice-List').append('<div class="card">' +
                                '<div class="item item-divider-clear">' + translations.invoiceno + ': ' + invoicenum + '</div>' +
                                '<div class="item item-text-wrap">' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.amount + '</div>' +
                                '<div class = "col kanan">&euro;' + total + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.date + '</div>' +
                                '<div class = "col kanan">' + d + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.duedate + '</div>' +
                                '<div class = "col kanan">' + dd + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.reference + '</div>' +
                                '<div class = "col kanan">' + notes + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.status + '</div>' +
                                '<div class = "col hijau">' + translations.paid + '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/download/' + invoiceid + '"><i class="icon ion-code-download"></i> Download </a> </div></div>');

                        } else {
                            var style = "assertive";
                            $('#Invoice-List').append('<div class="card">' +
                                '<div class="item item-divider-clear">' + translations.invoiceno + '#: ' + invoicenum + '</div>' +
                                '<div class="item item-text-wrap">' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.amount + '</div>' +
                                '<div class = "col kanan">&euro;' + total + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.date + '</div>' +
                                '<div class = "col kanan">' + d + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.duedate + '</div>' +
                                '<div class = "col kanan">' + dd + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.reference + '</div>' +
                                '<div class = "col kanan">' + notes + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.status + '</div>' +
                                '<div class = "col merah">' + translations.unpaid + '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/pay/' + invoiceid + '"><i class="icon ion-card"></i> ' + translations.payonline + ' </button> </div></div>');


                        }

                    });
                    $('#spin').hide();
                },
                error: function(e) {
                    //alert('Error: ' + e.message);
                }
            });
        });
    })
    .controller('PayCtrl', function($scope, apiUrl, $http, $stateParams, Serv, $localStorage, $ionicLoading, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        var id = $stateParams.id;
        var token = $localStorage.token;
        var link = apiUrl+'getinvoicedetail/' + id;
        $scope.id = id;
        $http.get(link).then(function(res) {
            //console.log(res);
            $scope.invoice = res;

        });
        $scope.openExternal = function(m) {
           cordova.InAppBrowser.open('https://secure.billi.be/gpredirect.php?id=' + id + '&gw=' + m + '&token=' + token, '_blank', 'closebuttoncaption=Back To MyBILLI', 'location=no');
            //window.open('https://secure.billi.be/gpredirect.php?id=' + id + '&gw=' + m + '&token=' + token, '_self', 'closebuttoncaption=Back To MyBILLI', 'location=no'); 
        };


    })
    .controller('InvoiceDownloadCtrl', function($scope, apiUrl, $state, $http, $stateParams, $localStorage, Serv, $ionicLoading, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);

        var id = $stateParams.id;
        var userid = $localStorage.userid;
        console.log(id);
         console.log(userid);

        /*var token = $localStorage.token;
         $ionicLoading.show({
                template: 'Downloading, Please wait....'
            });
        cordova.InAppBrowser.open('https://invoice.billi.be/v1/download/'+token+'/'+id, '_system', 'location=no'); 
		$ionic.Loading.hide();
		cordova.InAppBrowser.close();
		$state.go('side/invoices');
        */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
        });
    });
}

 $ionicLoading.show({
                template: 'Downloading, Please wait....'
            });
var link = "https://invoice.billi.be/v1/getinvoice";
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                userid: userid,
                invoiceid: id
            },
            success: function(data) {
console.log(data);
var myBase64 = data.pdf;
// Define the mimetype of the file to save, in this case a PDF
var contentType = "application/pdf";
// The path where the file will be saved
var folderpath = "file:///storage/emulated/0/Download/";
// The name of your file
var filename = id+".pdf";
savebase64AsPDF(folderpath,filename,myBase64,contentType);
$ionicLoading.hide();
window.open(encodeURI('file:///storage/emulated/0/Download/'+filename), '_system');
$state.go('side.invoices');                               
            }
        });

    })
    .controller('TicketsCtrl', function($scope, apiUrl, Serv, $localStorage, $ionicLoading, $translate) {
        $scope.curlang = $translate.use($localStorage.lang);
        $translate(['ticketid', 'ticketdate', 'ticketstatus', 'open_ticket', 'ticketsubject', 'ticketmessage', 'ticketpriority', 'ticketdepartment']).then(function(translations) {
            $ionicLoading.show({
                template: 'Please wait...'
            });


      

        
            var token = $localStorage.token;
            var link = apiUrl+'gettickets';
            $scope.loading = true;
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                        token: token
                },
                success: function(data) {
                    //console.log(data);
                    $ionicLoading.hide();
                    if (data.data == "empty") {
                        $('#Tickets-List').append('<h2><center>No Tickets Found.</center></h2>');
                    } else {


                        $.each(data.data, function(i, item) {
                            var style = "simson";
                            $('#Tickets-List').append('<div class="card">' +
                                '<div class="item item-divider-clear"><h2>' + translations.ticketid + ': ' + item.tid + '</h2></div>' +
                                '<div class="item item-text-wrap">' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.ticketsubject + '</div>' +
                                '<div class = "col kanan">' + item.title + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.ticketdate + '</div>' +
                                '<div class = "col kanan">' + item.date + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.ticketstatus + '</div>' +
                                '<div class = "col kanan">' + item.status + '</div>' +
                                '</div>' +
                                '<div class = "row">' +
                                '<div class = "col">' + translations.ticketdepartment + '</div>' +
                                '<div class = "col hijau">' + item.deptname + '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/viewticket/' + item.id + '"><i class="icon ion-code-download"></i> View Ticket </a> </div></div>');

                        });

                    }
                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });
        });
    })
    .controller('ViewTicketCtrl', function($scope, apiUrl, $http, $stateParams, $localStorage, Serv, $ionicModal, $state, $location, $timeout, $ionicPopup, $ionicLoading, $translate) {

        $scope.curlang = $translate.use($localStorage.lang);
    
        var id = $stateParams.id;
        $scope.ticketid = id;
        var token = $localStorage.token;
        $translate(['ticketid',
            'ticketdate',
            'staf_replied_on',
            'close_window',
            'you_replied_on',
            'open_ticket',
            'close_ticket',
            'reply_ticket',
            'ticketstatus',
            'ticketsubject',
            'submit',
            'ticketmessage',
            'ticketpriority',
            'confirm_close_ticket',
            'ticketdepartment'
        ]).then(function(translations) {

            $scope.replyticket = function(tick) {

                $ionicLoading.show({
                    template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
                });
                var linking2 = apiUrl+'replyticket';
                $.ajax({
                    type: "POST",
                    url: linking2,
                    dataType: "json",
                    data: {
                        ticketid: id,
                        msg: tick.message
                    },
                    success: function(data) {
                        $ionicLoading.hide();
                        $scope.modalreplyticket.hide();
					    $state.go('side.tickets');

                    },
                    error: function(e) {
                        alert('Error: ' + e.message);
                    }
                });

            };
            $scope.closeticket = function(id) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="android" class="spinner-energized">Closing your ticket</ion-spinner>'
                });
                var linking = apiUrl+'closeticket';
                $.ajax({
                    type: "POST",
                    url: linking,
                    dataType: "json",
                    data: {
                        ticketid: id
                    },
                    success: function(data) {
                        $ionicLoading.hide();
                        $scope.modalcloseticket.hide();
						 $state.go('side.tickets');
                    },
                    error: function(e) {
                        alert('Error: ' + e.message);
                    }
                });

            };



            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });

            var link = apiUrl+'viewticket';
            $scope.loading = true;
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    ticketid: id,
                    token: token
                },
                success: function(data) {
                    //console.log(data);
                    $ionicLoading.hide();
                    if (data.result == "OK") {
                        $('#ticketitle').append('<div class="card">' +
                            '<div class="item item-divider-clear bar-simson">' + translations.ticketid + ': ' + data.ticket.tid + '</div>' +
                            '<div class="item item-text-wrap">' +
                            '<div class = "row">' +
                            '<div class = "col">' + translations.ticketsubject + '</div>' +
                            '<div class = "col kanan">' + data.ticket.title + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">' + translations.ticketdate + '</div>' +
                            '<div class = "col kanan">' + data.ticket.date + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">' + translations.ticketstatus + '</div>' +
                            '<div class = "col kanan">' + data.ticket.status + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">' + translations.ticketdepartment + '</div>' +
                            '<div class = "col kanan">' + data.ticket.deptname + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="row">' +

                            '<div class="item item-text-wrap"><h6>' +

                            data.ticket.message +

                            '</h6></div>' +
                            '</div>' +

                            '</div>');
                        if (data.replies.data != "empty") {
                            $.each(data.replies.data, function(i, item) {

                                if (item.admin.length > 0) {

                                    $('#Replies-List').append('<div class="card">' +
                                        '<div class="item bar bar-simson">' + translations.staf_replied_on + ': ' + item.date + '</div>' +
                                        '<div class="item item-text-wrap"><h6>' + item.message + '</h6></div>' +
                                        '</div>');
                                } else {
                                    $('#Replies-List').append('<div class="card">' +
                                        '<div class="item bar bar-dark">' + translations.you_replied_on + ': ' + item.date + '</div>' +
                                        '<div class="item item-text-wrap"><h6>' + item.message + '</h6></div>' +
                                        '</div>');

                                }


                            });
                        }
                    }
                }
            });
            $scope.modalreplyticket = $ionicModal.fromTemplate('<ion-modal-view>' +
                ' <ion-header-bar>' +
                '<div class="col">' + translations.reply_ticket + ' </div><div class="col text-right"></div>' +
                '</ion-header-bar>' +

                '<ion-content>' +

                '<div class="list">' +
                '<label class="item item-input">' +
                ' <textarea ng-model="tick.message" placeholder="Comment" rows="10"></textarea>' +
                '</label>' +
                '</div><div class="row">' +
                '<div class="col"><a class="button button-block button-simson ion-minus" ng-click="closeModalreplyticket()"> ' + translations.close_window + '</a></div>' +
                '<div class="col"><a class="button button-block button-simson icon ion-ios-paperplane-outline" ng-click="replyticket(tick);"> ' + translations.submit + '</a></div>' +
                '</div>' +



                '</ion-content>' +

                '</ion-modal-view>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
            
			$scope.modalcloseticket = $ionicModal.fromTemplate('<ion-modal-view>' +
                ' <ion-header-bar>' +
                '<div class="col">' + translations.close_ticket + '</div><div class="col text-right"><button ng-click="closeModalSSID()" class="button button-simson">' + translations.close_window + '</button></div>' +
                '</ion-header-bar>' +

                '<ion-content>' +

                ' <div class="list">' +

                '<div class="item item-input-inset">' +
                '<label class="item-input-wrapper">' + translations.confirm_close_ticket +
                '</label>' +
                '<button ng-click="closeticket(id);" class="button button-small button-simson">' +
                '<i class="icon ion-social-buffer"></i>' + translations.close_ticket + '' +
                '</button>' +
                '</div>' +

                '</div>' +

                '</ion-content>' +

                '</ion-modal-view>', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
            $scope.openModalreplyticket = function(ticketid) {

                $scope.id = ticketid;
                $scope.modalreplyticket.show();
            };
            $scope.openModalcloseticket = function(ticketid) {


                $scope.id = ticketid;
                $scope.modalcloseticket.show();
            };
            $scope.closeModalreplyticket = function() {
                $scope.modalreplyticket.hide();
            };
            $scope.closeModalcloseticket = function() {
                $scope.modalcloseticket.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modalreplyticket.remove();
            });
            $scope.$on('$destroy', function() {
                $scope.modalcloseticket.remove();
            });

            // Execute action on hide modal
           
        });



    })

 .controller('TosCtrl', function($scope, apiUrl, $http, $stateParams, $localStorage, Serv, $ionicModal, $state, $ionicLoading, $translate) {
var lang = $localStorage.lang;

function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
        });
    });
}
 $ionicLoading.show({
                template: 'Downloading, Please wait....'
            });
var link = "https://invoice.billi.be/v1/tos/"+lang;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                lang: lang
            },
            success: function(data) {
                console.log(data);
var myBase64 = data.pdf;
// Define the mimetype of the file to save, in this case a PDF
var contentType = "application/pdf";
// The path where the file will be saved
var folderpath = "file:///storage/emulated/0/Download/";
// The name of your file
var filename = "tos_"+lang+".pdf";
savebase64AsPDF(folderpath,filename,myBase64,contentType);
$ionicLoading.hide();
window.open(encodeURI('file:///storage/emulated/0/Download/'+filename), '_system');                                
            }
        });









})
    .controller('MobileBlockCtrl', function($scope, apiUrl, $state, $ionicLoading, Serv, $ionicPopup, $timeout, $localStorage, $stateParams, $translate) {
        var id = $stateParams.id;
        $scope.curlang = $translate.use($localStorage.lang);
        $scope.block = function(reason) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
            var link = apiUrl+'fullbar';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    orderid: id,
                    val: '2',
                    reason: reason
                },
                success: function(data) {
                    $ionicLoading.hide();
                    ////console.log(data);

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
    })
    .controller('MobileUnBlockCtrl', function($scope, apiUrl, $state, $ionicLoading, Serv, $timeout, $ionicPopup, $localStorage, $stateParams, $translate) {
        var id = $stateParams.id;
        $scope.curlang = $translate.use($localStorage.lang);
        $scope.block = function(reason) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
            var link = apiUrl+'fullbar';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    orderid: id,
                    val: '0',
                    reason: reason
                },
                success: function(data) {
                    $ionicLoading.hide();
                    ////console.log(data);

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
    })
    .controller('ContactCtrl', function($scope, apiUrl, $translate, $compile) {
	//$scope.map = { center: { latitude: 50.785639, longitude: 5.517824 }, zoom: 15 };	
	 angular.extend($scope, {
        map: {
            center: {
                latitude: 50.785639,
                longitude: 5.517824
            },
            zoom: 18,
            markers: [],
            events: {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: 50.785639,
                        longitude: 5.517824
                    }
                };
                $scope.map.markers.push(marker);
                console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });
    /*
	document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
        var myLatlng = new google.maps.LatLng(50.785639,5.517824);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div>Billi BVBA</div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Billi BVBA',
		   icon: 'https://bpanel.billi.be/assets/img/billimark.png'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
 
        google.maps.event.addDomListener(window, 'load');      
 
	}
	*/

    })
.controller('PendingOrderCtrl', function($scope, apiUrl, $location, $ionicLoading, Serv, $timeout, $ionicPopup, $localStorage, $stateParams, $translate) {
        var userid = $localStorage.userid;
        var token = $localStorage.token;
        $scope.curlang = $translate.use($localStorage.lang);
        $scope.goTourl = function(path) {
  $location.path(path);
};
        $translate(['recurring', 'status', 'show_details']).then(function(translations) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
            var link = apiUrl+'getpendingorder';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    userid: userid,
                    token: token
                },
                success: function(data) {
                    console.log(data.data);
                    $ionicLoading.hide();
                    $.each(data.data, function(i, item) {
                    var regdate = item.date;
                    var image = item.image;
                    if (image.length == 0) {
                        var image = "internet-xxl.png";
                    }
                    var d = regdate;
                    d = d.substr(0, 10).split("-");
                    d = d[2] + "/" + d[1] + "/" + d[0];
                    if(item.server == 1){

                        if(item.paymentstatus == 'Paid'){
                        $scope.paymentdate = item.datepaid;
                            var step = 1;
                         $scope.percentage     = 25;
                         $scope.msg = "We have received your payment, and our staff is reviewing your order information for validation";
                        }else{
                         $scope.percentage     = 10;
                         $scope.msg = '<a ng-click="goTourl(\'/side/invoices\');" href="javascript:void(0);">We have received your order but you still need to pay the activation fee Tap here to pay it online</a>';

                        }
                       if(step == 1 && item.modem_sent == "1"){

                        var step =2;
                        $scope.modem_sentdate = item.modem_sent_date;
                        $scope.modem_tracking = item.trackingid;
                        $scope.percentage     = 50;
                        $scope.msg = "Your order has been validated and our staff has sent the modem check this tracking code "+item.trackingid;

                       }
                        if(step == 2 && item.install_date != null){
						var u = item.install_date;
						u = u.substr(0, 10).split("-");
                        u = u[2] + "/" + u[1] + "/" + u[0];

                        $scope.percentage     = 75;
                         $scope.installdate = u;
                         $scope.msg = "You have planned installation date with our planning services for "+u;

                        }else if(step == 2 && item.install_date == null){
                         $scope.percentage     = 60;
                         $scope.msg = "Once you received the modem please call the installation team 032 172 195, check the document in the package ";

                        }
                     

                        $('#Pending-List').append('<div class="item item-thumbnail-left"><img src="img/' + image + '" width="35"><h2>' + item.name + '</h2></div>' +
                        '<div class="item item-body">'+
                        '<div class="list"><div class="list">' + translations.status + ': ' + item.status + 
                         '<br />Order Date: '+d+ 
                        '<br />Invoice Paid: '+item.datepaid+ 

                        '<br />Modem Shipped: '+item.modem_sent_date+
                        '<br />BPOST: '+item.trackingid+ 
                        '<br />Install Date: '+item.install_date+ 
                       
                        '</div>'+
                        '</div></div>'+
                        '<div class="row">'+
    '<div class="col">'+
    '</div>'+
    '<div class="col">'+
    '<percent-circle percent="'+$scope.percentage+'" colors="{center:\'#fffed0\', highlight:\'#green\', remaining:\'#cc6699\'}"></percent-circle>'+
    '</div>'+
    '<div class="col">'+
    '</div>'+  
    '</div>'+
    '<p class="tengah">'+$scope.msg+'</p>');

                    }else{



                    }
                 
                });

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });
 });
    })
.controller('PendingViewCtrl', function($scope, apiUrl, $state, $ionicLoading, Serv, $timeout, $ionicPopup, $localStorage, $stateParams, $translate) {
        var id = $stateParams.id;
        $scope.curlang = $translate.use($localStorage.lang);
        $scope.block = function(reason) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
            });
            var link = apiUrl+'fullbar';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    orderid: id,
                    val: '0',
                    reason: reason
                },
                success: function(data) {
                    $ionicLoading.hide();
                    ////console.log(data);

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
    })
	
.controller('TestCtrl', function($scope, $http, apiUrl, Serv, $state, $ionicLoading, $localStorage, $translate) {
   $scope.curlang = $translate.use($localStorage.lang);

    
	var token = $localStorage.token;
	var userid = $localStorage.userid;
	
	 $scope.checkline = function(user) {
		   $ionicLoading.show({
        template: '<ion-spinner icon="lines"  class="spinner-energized"></ion-spinner>'
    });
	   var link = apiUrl+'checkline';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: user,
                success: function(data) {
                $localStorage.result = data;
                   //console.log(data);
                   $state.go('side.testresult');
				   $ionicLoading.hide();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
					$ionicLoading.hide();
                }
            });
			
			
	
	 };
	
})

.controller('TestResultCtrl', function($scope, apiUrl, $state, $ionicLoading, $localStorage, $translate) {
    $scope.curlang = $translate.use($localStorage.lang);
    $scope.result = $localStorage.result;
    console.log($scope.result);
    
})

.controller('AccountCtrl', function($scope, apiUrl, $ionicLoading, $localStorage, Serv, $stateParams, $compile, $translate) {
    $scope.curlang = $translate.use($localStorage.lang);
	var token = $localStorage.token;
	var userid = $localStorage.userid;
	    $scope.pushNotificationChange = function(data) {
			  $ionicLoading.show({
      template: '<ion-spinner icon="lines"  class="spinner-energized"></ion-spinner>'
    });
			var str = data.split(':');	
		if(str[1] == 'true'){
			
			var value='yes';
		}else{
			var value='no';
		}
					$.ajax({
                        type: "POST",
                        url: apiUrl+'setcustomfieldsvalue',
                        dataType: "json",
                        data: {
                            userid: userid,
                            val: value,
							fieldid: '9'
                        },
                        success: function(data) {
                            $ionicLoading.hide();
                            console.log(data);

                        },
                        error: function(e) {
							 $ionicLoading.hide();
                            alert('Error: ' + e.message);
                        }
                    });

                };

                
	$scope.saveclient = function(cc) {
		 $ionicLoading.show({
        template: '<ion-spinner icon="android" class="spinner-energized"></ion-spinner>'
    });
	

			$.ajax({
                        type: "POST",
                        url: apiUrl+'updateclientinfo',
                        dataType: "json",
                        data: {
		'id': userid,
		'token': token,
		'firstname': cc.firstname,
		'lastname': cc.lastname,
		'country': cc.country,
		'address1': cc.address1,
		'postcode': cc.postcode,
		'paymentmethod': cc.defaultgateway,
		'language': cc.language,
		'email': cc.email,
		'phonenumber': cc.phonenumber,
		'city': cc.city,
		'customfields': {
			'51': cc.nationalnumber,
			'9' : cc.einvoice
		}
	},
						
                        success: function(data) {
                        if(cc.language == "french"){
                        $localStorage.lang = "fr";
                        }else if(cc.language == "dutch"){
                        $localStorage.lang =  "nl";
                        }else{
                        $localStorage.lang = "en";

                        }
                        
                            $ionicLoading.hide();

                            $state.reload();

                        },
                        error: function(e) {
							 $ionicLoading.hide();
                            alert('Error: ' + e.message);
                        }
                    });
					
					
	
	};
			$scope.settings = {
        enableFriends: true
    };
	

    var dutch = '';
    var french = '';
    var english = '';

    var link = apiUrl+"getdetail";
    $ionicLoading.show({
        template: '<ion-spinner icon="lines"  class="spinner-energized"></ion-spinner>'
    });
    $.ajax({
        type: "POST",
        url: link,
        dataType: "json",
        data: {
            uuid: dutch
        },

        success: function(kuman) {
            console.log(kuman);
	$scope.kuman = kuman.client;
	$scope.extra = kuman.extra;
	var extra = [];
	$scope.nationalnumber = "";
		$scope.pushNotification_einvoice = {
                    checked: false,
                    id: 'einvoice'
                };
	 $.each(kuman.extra, function(i, item) {
		if(item.fieldid == "9" && item.value == "yes"){
		$scope.pushNotification_einvoice = {
                    checked: true,
                    id: 'einvoice'
                };
			
		}	
	if(item.fieldid == "51"){
		$scope.kuman.nationalnumber = item.value;
		
		}
		if(kuman.client.groupid != "1" || kuman.client.groupid != "2"){
		$scope.company = true;
		if(item.fieldid == "1"){
		$scope.kuman.btw = item.value;
		}		
			
		}
		
	 });
	if(kuman.client.language == "dutch"){
		var op = 'dutch';	
		}else if(kuman.client.language == "french"){
		 var op = 'french';
		}else{
		var op = 'english';	
		}
	if(kuman.client.defaultgateway == "sisowmc"){
		var pay = 'sisowmc';	
		}else if(kuman.client.defaultgateway == "sisowcc"){
		 var pay = 'sisowcc';
		}else if(kuman.client.defaultgateway == "paypal"){
		var pay = 'paypal';
		}else{
		var pay = 'sisowmc';	
		}
	$scope.filterCondition = {
		operator: op
       
    }
	$scope.filterCondition1 = {
		operator: pay
       
    }
	$scope.filterCondition2 = {
		operator: kuman.client.country
       
    }

	$scope.payments = [{
        value: 'sisowmc',
        displayName: 'Bancontact'
    }, {
        value: 'sisowcc',
        displayName: 'Mastercad VISA'
    },{
        value: 'paypal',
        displayName: 'Paypal'
    }];
	
	
    $scope.operators = [{
        value: 'english',
        displayName: 'English'
    }, {
        value: 'french',
        displayName: 'Français'
    },{
        value: 'dutch',
        displayName: 'Nederlands'
    }];
	
	$scope.countries = [
	  { displayName: '', value: ''},
      { displayName: 'Belgium', value: 'BE'},
      { displayName: 'French', value: 'FR'},
      { displayName: 'Germany', value: 'DE'},
      { displayName: 'Luxemburg', value: 'LU'},
      { displayName: 'Netherlands', value: 'NL'},
      { displayName: 'Switzerland', value: 'CZ'},
	  { displayName: 'Italy', value: 'IT'},
      { displayName: 'United Kindom', value: 'UK'
	  }];
	
	
 $scope.settingsList = extra;
   $ionicLoading.hide();
          },
        error: function(e) {
            alert('Error: ' + e.message);
        }
    });



});
