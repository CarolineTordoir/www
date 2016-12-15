// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','billi','ngCordova','uiGmapgoogle-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
       $translateProvider.translations('en', translations_en); 
       $translateProvider.translations('fr', translations_fr);
	   $translateProvider.translations('nl', translations_nl);
       $translateProvider.preferredLanguage('en');
	//$translateProvider.useSanitizeValueStrategy('sanitize');
	$translateProvider.useSanitizeValueStrategy('sanitizeParameters');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    })
  
   //or the tabs directive

  .state('logout', {
                        url: '/logout',
                        templateUrl: 'templates/logout.html',
                        controller: 'LogoutCtrl'
                    })
  .state('side', {
    url: '/side',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('side.smsconfirm', {
    url: '/smsconfirm/:id',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/smsconfirm.html',
        controller: 'SmsConfirmCtrl'
      }
    }
  })

   .state('side.forgotpw', {
    url: '/forgotpw',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/forgotpw.html',
        controller: 'ForogotPassCtrl'
      }
    }
  })

.state('side.linetest', {
    url: '/linetest',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/test.html',
        controller: 'TestCtrl'
      }
    }
  })
  
  
   .state('side.validatetoken', {
    url: '/validatetoken',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/validatetoken.html',
        controller: 'validatetokenCtrl'
      }
    }
  })
  
  
  .state('side.dash', {
    url: '/dash',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('side.pay', {
    url: '/pay/:id',
    cache: false,
    views: {
       menuContent: {
        templateUrl: 'templates/pay.html',
        controller: 'PayCtrl'
      }
    }
  })

  .state('side.internet', {
      url: '/internet',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/internet.html',
          controller: 'InternetCtrl'
        }
      }
    })
 .state('side.pendingorder', {
      url: '/pendingorder',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/pendingorder.html',
          controller: 'PendingOrderCtrl'
        }
      }
    })

  .state('side.pendingview', {
      url: '/pendingview/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/pendingview.html',
          controller: 'PendingViewCtrl'
        }
      }
    })


  .state('side.internetdetail', {
      url: '/internetdetail/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/internetdetail.html',
          controller: 'InternetDetailsCtrl'
        }
      }
    })
  .state('side.tos', {
      url: '/tos',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/tos.html',
          controller: 'TosCtrl'
        }
      }
    })
	
	.state('side.openticket', {
      url: '/openticket',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/openticket.html',
          controller: 'OpenTicketCtrl'
        }
      }
    })

  .state('side.mobile', {
      url: '/mobile',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/mobile.html',
          controller: 'MobileCtrl'
        }
      }
    })
  .state('side.mobiledetail', {
      url: '/mobiledetail/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/mobiledetail.html',
          controller: 'MobileDetailsCtrl'
        }
      }
    })
  .state('side.mobilecdr', {
      url: '/mobilecdr/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/mobilecdr.html',
          controller: 'MobileCdrCtrl'
        }
      }
    })
  .state('side.mobileblock', {
      url: '/mobileblock/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/mobileblock.html',
          controller: 'MobileBlockCtrl'
        }
      }
    })

  .state('side.tv', {
      url: '/tv',
      views: {
        menuContent: {
          templateUrl: 'templates/tv.html',
          controller: 'TVCtrl'
        }
      }
    })
  .state('side.voip', {
      url: '/voip',
	   cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/voip.html',
          controller: 'VoipCtrl'
        }
      }
    })
	.state('side.voipview', {
      url: '/voipview/:id',
	   cache: false,
       views: {
        menuContent: {
          templateUrl: 'templates/voipview.html',
          controller: 'VoipViewCtrl'
        }
      }
    })
  .state('side.invoices', {
      url: '/invoices',
      views: {
        menuContent: {
          templateUrl: 'templates/invoices.html',
          controller: 'InvoiceCtrl'
        }
      }
    })
  .state('side.contact', {
      url: '/contact',
         cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/contacts.html',
          controller: 'ContactCtrl'
        }
      }
    })
  .state('side.tickets', {
      url: '/tickets',
	   cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/tickets.html',
          controller: 'TicketsCtrl'
        }
      }
    })
	
	 .state('side.viewticket', {
      url: '/viewticket/:id',
      cache: false,
      views: {
        menuContent: {
          templateUrl: 'templates/viewticket.html',
          controller: 'ViewTicketCtrl'
        }
      }
    })
	
	
   .state('side.download', {
      url: '/download/:id',
      views: {
        menuContent: {
          templateUrl: 'templates/invoices.html',
          controller: 'InvoiceDownloadCtrl'
        }
      }
    })
  .state('side.account', {
    url: '/account',
    views: {
       menuContent: {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
