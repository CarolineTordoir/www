angular.module('starter.services', [])

.factory('Serv', function($http, $localStorage) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    return {
        login: function(login) {
            if(device.uuid == null){

                var uuid = "browser"+device.version;
            }else{


                var uuid = device.uuid;
            }
            var name = device.platform;
            var version =device.version;
            $localStorage.billiuser = login.username;
            var phone = login.phone;
            return $http.get("https://api.billi.be/mobile/login/?login=" + login.username + "&pass=" + login.password + "&uuid=" + uuid +"&version=" + version+ "&name=" + name+'&phone='+phone);
        },
        submiticket: function(submiticket) {
            var link = "https://api.billi.be/mobile/submitticket";
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    did: submiticket.did,
                    message: submiticket.message,
                    title: submiticket.title
                },
                success: function(i) {
                    return i;
                }
            });

        },
        block: function(id) {
            var uuid = device.uuid;
            var name = device.platform;
            return $http.get("https://api.billi.be/mobile/block/?number=" + id);
        },
        autologin: function(token) {
            return $http.get("https://api.billi.be/mobile/getsession");
        },
        findByOrderId: function(data) {

            return $http.get("https://api.billi.be/mobile/getservicedetail/");

        }
    };
});