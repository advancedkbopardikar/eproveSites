'use strict';
var autoPlayVideo, features, featuresSlider, getUrlParameter, screenshots, screenshotsSlider, stopVideoPlayback, testimonials, testimonialsSlider, videoId;

jQuery(document).foundation();

features = void 0;

screenshots = void 0;

testimonials = void 0;

featuresSlider = function() {
  features = new IScroll('#features', {
    eventPassthrough: true,
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: true,
    snapSpeed: 400
  });
};

screenshotsSlider = function() {
  screenshots = new IScroll('#screenshots', {
    eventPassthrough: true,
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: true,
    snapSpeed: 400
  });
  jQuery('.screenshots__nav.prev').click(function() {
    return screenshots.prev();
  });
  jQuery('.screenshots__nav.next').click(function() {
    return screenshots.next();
  });
};

testimonialsSlider = function() {
  testimonials = new IScroll('#testimonials', {
    eventPassthrough: true,
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: true,
    snapSpeed: 400
  });
};

featuresSlider();

screenshotsSlider();

getUrlParameter = function(sParam) {
  var i, sPageURL, sParameterName, sURLVariables;
  sPageURL = window.location.search.substring(1);
  sURLVariables = sPageURL.split('&');
  i = 0;
  while (i < sURLVariables.length) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1];
    }
    i++;
  }
};

videoId = "#" + getUrlParameter("video");

stopVideoPlayback = function() {
  return jQuery(videoId).attr('src', $('iframe').attr('src').replace('?autoplay=true', ''));
};

autoPlayVideo = function() {
  if (videoId) {
    return jQuery("a[data-reveal-id='videoModal']").click();
  }
};

jQuery("a[data-reveal-id='videoModal']").click(function() {
  return jQuery('#eleottour')[0].src = "https://player.vimeo.com/video/122350348?autoplay=true";
});

jQuery(document).on('click tap', '.reveal-modal-bg, #closeVideoModal', function() {
  return jQuery('#eleottour')[0].src = "";
});

$(function() {
  if (getUrlParameter("video")) {
    return autoPlayVideo();
  }
});

angular.module('eleot', ['ngSanitize']).config(function() {});

jQuery(document).ready(function() {
  $('.main-content').scroll(function() {
    if ($('.main-content').scrollTop() > 700) {
      $('header').addClass('bg');
    } else {
      $('header').removeClass('bg');
    }
  });
});

angular.module('eleot').filter("join", function() {
  return function(list, sep) {
    return list.join(sep);
  };
});

angular.module('eleot').filter("notEmpty", function() {
  return function(inp_list) {
    var out_list;
    out_list = [];
    angular.forEach(inp_list, function(item) {
      if (item && item !== '' && item !== 'NULL') {
        return out_list.push(item);
      }
    });
    return out_list;
  };
});

angular.module('eleot').filter("gradeSuffixed", function() {
  return function(grades) {
    var grade;
    if (!grades || grades.length === 0) {
      return "";
    } else {
      grade = grades.slice(-1)[0];
      if (grade === "K" || grade === "k") {
        return "Kindergarten";
      } else if (grade === "1") {
        return grades.join(' / ') + "st Grade";
      } else if (grade === "2") {
        return grades.join(' / ') + "nd Grade";
      } else if (grade === "3") {
        return grades.join(' / ') + "rd Grade";
      } else {
        return grades.join(' / ') + "th Grade";
      }
    }
  };
});

angular.module('eleot').filter("humanize", function() {
  return function(phrase) {
    if (phrase === 'created_at') {
      return 'Date';
    } else if (phrase) {
      return phrase.split(/_|\./).map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
    } else {
      return '';
    }
  };
});

angular.module('eleot').directive("autocompleteobjects", function() {
  var index;
  index = -1;
  return {
    restrict: "E",
    scope: {
      searchParam: "=ngModel",
      suggestions: "=data",
      fetching: "=fetchFlag",
      noMatchesMsg: "=noMatchesMsg",
      onType: "=onType",
      onSelect: "=onSelect"
    },
    controller: [
      "$scope", function($scope) {
        var watching;
        $scope.selectedIndex = -1;
        $scope.setIndex = function(i) {
          $scope.selectedIndex = parseInt(i);
        };
        this.setIndex = function(i) {
          $scope.setIndex(i);
          $scope.$apply();
        };
        $scope.getIndex = function(i) {
          return $scope.selectedIndex;
        };
        watching = true;
        $scope.completing = false;
        $scope.$watch("searchParam", function(newValue, oldValue) {
          if (!$scope.inFocus) {
            return;
          }
          if (oldValue === newValue) {
            return;
          }
          if (watching && $scope.searchParam) {
            $scope.completing = true;
            $scope.searchFilter = $scope.searchParam;
            $scope.selectedIndex = -1;
          }
          if (watching) {
            if ($scope.onType) {
              $scope.onType($scope.searchParam);
            }
          }
        });
        this.preSelect = function(suggestion) {
          watching = false;
          $scope.$apply();
          watching = true;
        };
        $scope.preSelect = this.preSelect;
        this.preSelectOff = function() {
          watching = true;
        };
        $scope.preSelectOff = this.preSelectOff;
        return $scope.select = function(suggestion) {
          if (suggestion) {
            $scope.searchParam = (typeof suggestion === "object" ? suggestion.name : suggestion);
            $scope.searchFilter = $scope.searchParam;
            if ($scope.onSelect) {
              $scope.onSelect(suggestion);
            }
            if (!$scope.$parent.observation.instructor.email) {
              $scope.$parent.observation.instructor.email = suggestion.email;
            }
          }
          watching = false;
          $scope.completing = false;
          $scope.scrolling = false;
          setTimeout((function() {
            watching = true;
          }), 1000);
          $scope.setIndex(-1);
        };
      }
    ],
    templateUrl: function(element, attrs) {
      return attrs.acTemplateUrl || "partials/autocomplete/autocomplete-objects.html";
    },
    link: function(scope, element, attrs) {
      var a, ac_container, attr, key;
      attr = "";
      scope.attrs = {
        placeholder: "start typing...",
        "class": "",
        id: "",
        inputclass: "",
        inputid: ""
      };
      element.find('input')[0].addEventListener("focus", function(e) {
        return scope.inFocus = true;
      });
      element.find('input')[0].addEventListener("blur", function(e) {
        if (scope.scrolling !== true) {
          return scope.inFocus = false;
        }
      });
      element.find('ul')[0].addEventListener("touchstart", function(e) {
        return scope.scrolling = true;
      });
      ac_container = document.getElementById("ac-container");
      if (ac_container) {
        ac_container.addEventListener("touchstart", function(e) {
          if (!e.srcElement.hasAttribute('suggestion-object') && e.srcElement !== element.find('input')[0] && !e.srcElement.hasAttribute('ac-line-item')) {
            scope.select();
            scope.setIndex(-1);
            return scope.$apply();
          }
        });
      }
      for (a in attrs) {
        attr = a.replace("attr", "").toLowerCase();
        if (a.indexOf("attr") === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }
      if (attrs.clickActivation) {
        element[0].onclick = function(e) {
          if (!scope.searchParam) {
            scope.completing = true;
            scope.$apply();
          }
        };
      }
      key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        enter: 13,
        esc: 27
      };
      document.addEventListener("keydown", (function(e) {
        var keycode;
        keycode = e.keyCode || e.which;
        switch (keycode) {
          case key.esc:
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
        }
      }), true);
      document.addEventListener("blur", (function(e) {
        setTimeout((function() {
          if (scope.completing === true && !scope.scrolling) {
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
          }
        }), 300);
      }), true);
      element[0].addEventListener("keydown", function(e) {
        var keycode, l, src_object;
        keycode = e.keyCode || e.which;
        l = angular.element(this).find("li").length;
        switch (keycode) {
          case key.up:
            index = scope.getIndex() - 1;
            if (index < -1) {
              index = l - 1;
            } else if (index >= l) {
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              break;
            }
            scope.setIndex(index);
            if (index !== -1) {
              scope.preSelect(angular.element(angular.element(this).find("li")[index]).text());
            }
            scope.$apply();
            break;
          case key.down:
            index = scope.getIndex() + 1;
            if (index < -1) {
              index = l - 1;
            } else if (index >= l) {
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              scope.$apply();
              break;
            }
            scope.setIndex(index);
            if (index !== -1) {
              scope.preSelect(angular.element(angular.element(this).find("li")[index]).text());
            }
            break;
          case key.left:
          case key.right:
          case key.enter:
            index = scope.getIndex();
            if (index !== -1) {
              src_object = angular.element(angular.element(this).find("li")[index]).attr("data-srcobject");
              if (src_object) {
                src_object = JSON.parse(src_object);
              } else {
                src_object = angular.element(angular.element(this).find("li")[index]).text();
              }
              scope.select(src_object);
              scope.setIndex(-1);
              scope.$apply();
            }
            break;
          case key.esc:
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }
        if (scope.getIndex() !== -1 || keycode === key.enter) {
          e.preventDefault();
        }
      });
    }
  };
});

angular.module('eleot').filter("highlight_object", [
  "$sce", function($sce) {
    return function(input, searchParam) {
      var exp, words;
      if (typeof input === "function") {
        return "";
      }
      if (typeof searchParam === "object") {
        searchParam = searchParam.name;
      }
      if (searchParam) {
        words = "(" + searchParam.split(/\ /).join(" |") + "|" + searchParam.split(/\ /).join("|") + ")";
        exp = new RegExp(words, "gi");
        if (words.length) {
          input = input.replace(exp, "<span class=\"highlight\">$1</span>");
        }
      }
      return $sce.trustAsHtml(input);
    };
  }
]);

angular.module('eleot').directive("suggestion-object", function() {
  return {
    restrict: "A",
    require: "^autocompleteobjects",
    link: function(scope, element, attrs, autoCtrl) {
      element.bind("mouseenter", function() {
        autoCtrl.preSelect(attrs.val);
        autoCtrl.setIndex(attrs.index);
      });
      element.bind("mouseleave", function() {
        autoCtrl.preSelectOff();
      });
    }
  };
});

'use strict';
var environment, type, value, variables, _ref;

environment = null || 'development';

variables = {
  development: {
    ES_HOST: ''
  },
  staging: {
    ES_HOST: ''
  },
  production: {
    ES_HOST: ''
  }
};

angular.module('eleot').value('VERSION', '1.3.0');

_ref = variables[environment];
for (type in _ref) {
  value = _ref[type];
  angular.module('eleot').value(type, value);
}

'use strict';
angular.module('eleot').service('Preloader', function($http, ES_HOST) {
  var ES_INDEX, ES_SCHOOLS_TYPE, ES_SCHOOLS_URL;
  ES_INDEX = 'schools';
  ES_SCHOOLS_TYPE = 'school';
  ES_SCHOOLS_URL = [ES_HOST, ES_INDEX, ES_SCHOOLS_TYPE].join('/');
  return {
    find_schools: function(args) {
      return $http.post(ES_SCHOOLS_URL + '/_search', {
        "size": 10,
        "query": {
          "match": {
            "_all": {
              "query": args.prefix,
              "operator": "and"
            }
          }
        }
      }).success(function(data, status, headers, config) {
        var schools;
        schools = [];
        angular.forEach(data.hits.hits.map(function(e) {
          return e._source;
        }), function(school) {
          Object.keys(school).map(function(field) {
            if (school[field] === 'NULL') {
              return school[field] = null;
            }
          });
          return schools.push(school);
        });
        return args.then(schools, status);
      }).error(function(data, status, headers, config) {
        return args.then(data, status);
      });
    }
  };
});

'use strict';
angular.module('eleot').service('User', function($http, $filter, ES_HOST) {
  var PasswordResetStatusMessages, SignupStatusMessages;
  SignupStatusMessages = [
    {
      msg: 'Created, email sent',
      desc: function(user) {
        return 'Thank you for signing up for eleot!<br />An email has been sent to ' + user.email + '<br /><br />Please select the link in that email to complete your signup.';
      }
    }, {
      msg: 'Email not validated, email sent',
      desc: function(user) {
        return 'The user account already exists, but was not validated and a new validation email was sent to the specified email. Unvalidated emails are purged in 24 hours.';
      }
    }, {
      msg: 'Not created',
      desc: function(user) {
        return 'The institution has been registered by another user and an email has been sent to the admin requesting access.';
      }
    }, {
      msg: 'Registration call failed.',
      desc: function(user) {
        return 'Registration call failed.';
      }
    }
  ];
  PasswordResetStatusMessages = [
    {
      msg: 'success',
      desc: 'A password reset link has sent to the email address.'
    }, {
      msg: 'failed',
      desc: 'The email address you provided was not found.'
    }
  ];
  return {
    attemptLoginAs: function(user, callback) {
      return $http.post('/login', $.param({
        username: user.email,
        password: user.password
      }), {
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).success(function(data, status, headers, config) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + data.access_token;
        return callback.then(data, status);
      }).error(function(data, status, headers, config) {
        return callback.then(data, status);
      });
    },
    signupAs: function(user, callback) {
      return $http.put('/eleot-api/register', user, {
        "headers": {
          "Content-Type": "application/json"
        }
      }).success(function(data, status, headers, config) {
        return callback.then($filter('filter')(SignupStatusMessages, {
          msg: data.status
        }, true)[0].desc(user), status);
      }).error(function(data, status, headers, config) {
        return callback.then(data, status);
      });
    },
    forgotPasswordFor: function(user, callback) {
      return $http.post('/eleot-api/forgotPassword', $.param({
        username: user.email
      }), {
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).success(function(data, status, headers, config) {
        return callback.then($filter('filter')(PasswordResetStatusMessages, {
          msg: data.status
        }, true)[0], status);
      }).error(function(data, status, headers, config) {
        return callback.then(data, status);
      });
    },
    profileFor: function(data, callback) {
      var roster, school_ids, _i, _len, _profile, _ref;
      _profile = {
        id: data.user.rosters[0].id,
        email: data.user.rosters[0].email,
        name: data.user.rosters[0].name,
        certified: false,
        total_schools: data.user.rosters.length,
        schools: []
      };
      school_ids = [];
      _ref = data.user.rosters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        roster = _ref[_i];
        if (school_ids.indexOf(roster.school_id) === -1) {
          _profile.schools.push(roster);
          school_ids.push(roster.school_id);
        }
      }
      $http.get('/eleot-api/isUserCertified/' + _profile.id).success(function(data, status, headers, config) {
        return _profile.certified = JSON.parse(data);
      });
      return $http.post(ES_HOST + '/schools/school/_search', {
        size: school_ids.length,
        filter: {
          terms: {
            id: school_ids
          }
        }
      }).success(function(schools_detail, sr_status, sr_headers, sr_config) {
        _profile.schools = _profile.schools.map(function(school) {
          var i, school_detail, _j, _len1, _ref1;
          _ref1 = schools_detail.hits.hits;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            school_detail = _ref1[i];
            if (school_detail._source.id === school.school_id) {
              school.address1 = school_detail._source.address1;
              school.address2 = school_detail._source.address2;
              school.city = school_detail._source.city;
              school.state = school_detail._source.state;
              school.countryCode = school_detail._source.countryCode;
              school.postalCode = school_detail._source.postalCode;
            }
          }
          return school;
        });
        return callback(_profile, 200);
      }).error(function(srErrMsg, sr_status, sr_headers, sr_config) {
        return callback(srErrMsg, status);
      });
    }
  };
});

angular.module('eleot').controller('LandingCtrl', function($window, $scope, Preloader, User) {
  if ($window.localStorage.currentUser) {
    $scope.currentUser = $window.localStorage.currentUser;
  }
  $scope.hideRightMenu = function(event) {
    angular.element('a.exit-off-canvas').click();
    return null;
  };
  $scope.signupAs = function(user) {
    if ($scope.signup_form.$invalid) {
      $scope.signup_failed = false;
      return $scope.invalid_submit_attempted = true;
    } else {
      $scope.loading = true;
      return User.signupAs(user, {
        then: function(statusMessage, status) {
          $scope.loading = false;
          if (status === 0 || status === 404) {
            $scope.signup_failed = true;
            if (statusMessage.length === 0) {
              return $scope.signup_failure_reason = "Could not reach the eleot server!";
            } else {
              return $scope.signup_failure_reason = statusMessage;
            }
          } else {
            if (statusMessage === "Registration call failed.") {
              $scope.signup_failure_reason = statusMessage;
              $scope.signup_failed = true;
              return $scope.signup_success = false;
            } else {
              $scope.signup_failed = false;
              $scope.signup_success = true;
              return $scope.signup_status = statusMessage;
            }
          }
        }
      });
    }
  };
  $scope.selectSchool = function(selected_object) {
    return $scope.user.schoolID = selected_object.id;
  };
  return $scope.fetchSchools = function(prefix) {
    $scope.fetching = true;
    return Preloader.find_schools({
      prefix: prefix,
      then: function(schools, status) {
        $scope.schools = schools;
        return $scope.fetching = false;
      }
    });
  };
});
