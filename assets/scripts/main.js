var lat = 0;
var lang = 0;
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http, $timeout, $filter, $interval) {
    $scope.getcookieSchoolPage = function () {
        $scope.school = $scope.getCookieValue('school') ? JSON.parse($scope.getCookieValue('school')) : []
        lat = $scope.school.alt;
        lang = $scope.school.lang
        var mapCanvas = document.getElementById("map");
        var myCenter = new google.maps.LatLng(lat, lang);
        var mapOptions = { center: myCenter, zoom: 16 };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var marker = new google.maps.Marker({
            position: myCenter,
            animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(map);
    }
    $scope.subsystem = [];
    $scope.getcookieSearchPage = function () {
        $scope.subsystem = $scope.getCookieValue('mySystem') ? JSON.parse($scope.getCookieValue('mySystem')) : []
        $scope.indexSearch = $scope.getCookieValue('mySystem') ? JSON.parse($scope.getCookieValue('mySystem')) : []
    }
    $scope.getcookieCompairePage = function () {
        $scope.compaireCart = $scope.getCookieValue('compaireCart') ? JSON.parse($scope.getCookieValue('compaireCart')) : []
    }
    $http.get("data/systems.json")
        .then(function (response) {
            $scope.systems = response.data.systems
        })
    $http.get("data/topRated.json")
        .then(function (response) {
            $scope.tops = response.data.tops
        })
    $scope.systemType = function (x) {
        if (x == 1) {
            $http.get("data/university.json")
                .then(function (response) {
                    $scope.searchResult = response.data.university
                    $scope.subSystem($scope.searchResult)
                })
        }
        else if (x == 2) {
            $http.get("data/inistitute.json")
                .then(function (response) {
                    $scope.searchResult = response.data.inistitute
                    $scope.subSystem($scope.searchResult)
                })
        }
        else {
            $http.get("data/college.json")
                .then(function (response) {
                    $scope.searchResult = response.data.college
                    $scope.subSystem($scope.searchResult)
                })
        }
    }
    $scope.subSystem = function (x) {
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);
        var cookieItem = [];
        var cookieItem = JSON.stringify(x);
        document.cookie = "mySystem= " + cookieItem + ";expires=" + now.toUTCString() + ";path =/";
        window.location.href = "search_results.html";
    }
    $scope.getCookieValue = function (a) {
        var b = document.cookie.match(new RegExp(a + '=([^;]+)'));
        return b ? b.pop() : '';
    }
    $scope.info = function (x, y) {
        if (x == 1) {
            $("#info" + y).css("display", "block")
        }
        else {
            $("#info" + y).addClass("unload");
            setTimeout(function () {
                $("#info" + y).removeClass("unload");
                $("#info" + y).css("display", "none")
            }, 1000)
        }
    }
    $scope.systemSearch = function (x) {
        $(".checking").css("display", "none");
        $("#check" + x).css("display", "block");
        if (x == 1) {
            $http.get("data/university.json")
                .then(function (response) {
                    $scope.indexSearch = response.data.university
                })
        }
        else if (x == 2) {
            $http.get("data/inistitute.json")
                .then(function (response) {
                    $scope.indexSearch = response.data.inistitute
                })
        }
        else {
            $http.get("data/college.json")
                .then(function (response) {
                    $scope.indexSearch = response.data.college
                })
        }
        count = -1;
    }
    $scope.searchBox = function (x) {
        if (x == 1) {
            if(window.innerWidth < 760){
               $(".search-form").animate({ width: "60%" },"slow") 
            }
            else{
                $(".search-form").animate({ width: "30%" },"slow")
            }
            $(".container-filter").css("filter", "blur(40px)")
            $(".container-filter").css("pointer-events", 'none')
        }
        else {
            $(".search-form").animate({ width: "0%" })
            $(".container-filter").css("filter", "blur(0px)")
            $(".container-filter").css("pointer-events", '')
            $(".checking").css("display", "none")
            $scope.indexSearch = []
        }
    }
    $scope.schoolPage = function (x) {
        for (var i = 0; i < $scope.indexSearch.length; i++) {
            if ($scope.indexSearch[i].id == x) {
                var now = new Date();
                var time = now.getTime();
                time += 3600 * 1000;
                now.setTime(time);
                var cookieItem = [];
                var cookieItem = JSON.stringify($scope.indexSearch[i]);
                document.cookie = "school = " + cookieItem + ";expires=" + now.toUTCString() + ";path =/";
            }
        }
        window.location.href = "search_result.html"
    }
    $scope.compaireItems = []
    $scope.compaire = function (id) {
        var item = {}
        $("input:checked").each(function () {
            $(".compaire").css("display", "block")
        })
        if ($("#input" + id).is(':checked')) {
            for (var i = 0; i < $scope.subsystem.length; i++) {
                if ($scope.subsystem[i].id == id) {
                    if ($scope.compaireItems.length < 4) {
                        $scope.compaireItems.push($scope.subsystem[i])
                    }
                    else {
                        alert("شما نمیتوانید بیش از 4 محصول را انتخاب کنید")
                    }
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < $scope.compaireItems.length; i++) {
                if ($scope.compaireItems[i].id == id) {
                    $scope.compaireItems.splice(i, 1)
                }
            }
        }
    }
    $scope.compaireButton = function () {
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);
        var cookieItem = [];
        var cookieItem = JSON.stringify($scope.compaireItems);
        document.cookie = "compaireCart = " + cookieItem + ";expires=" + now.toUTCString() + ";path =/";
        $scope.location()
    }
    $scope.location = function () {
        window.location.href = "compaire.html"
    }
    $scope.top = function (x) {
        for (var i = 0; i < $scope.tops.length; i++) {
            if ($scope.tops[i].id == x) {
                var now = new Date();
                var time = now.getTime();
                time += 3600 * 1000;
                now.setTime(time);
                var cookieItem = [];
                var cookieItem = JSON.stringify($scope.tops[i]);
                document.cookie = "school = " + cookieItem + ";expires=" + now.toUTCString() + ";path =/";
            }
        }
        window.location.href = "search_result.html"
    }
    document.onkeydown = checkKey;
    var count = -1;
    var page = 1;
    function checkKey(e) {
        // that works when search get smaller or bigger
        // if ($(".searchLink").length != 0) {
        //     $scope.listItems = $(".searchLink")
        // }
        e = e || window.event;
        // it reduce count when kry up is pressed
        // console.log(count)
        if (e.keyCode == '38') {
            if (count < 1) {
                // page = Math.floor($scope.listItems.length / 5)
                // $('.searchResult').animate({ scrollTop: 300 * page }, 'fast');
                count = ($scope.indexSearch.length) - 1
            }
            else {
                count--
                // if (count % 4 == 0) {
                //     if (count - 4 < 1) {
                //         $('.searchResult').animate({ scrollTop: 0 }, 'slow');
                //         page = 1
                //     }
                //     else {
                //         page--
                //         $('.searchResult').animate({ scrollTop: 300 * page }, 'slow');
                //     }
                // }
            }
            // console.log("up has been happened")
        }
        // it increase count when key down is pressed
        else if (e.keyCode == '40') {
            if (count > ($scope.indexSearch.length) - 2) {
                count = 0
                page = 1;
                // $('.searchResult').animate({ scrollTop: 0 }, 'fast');
            }
            else {
                count++
                // if (count % 5 == 0 && count != 0) {
                //     $('.searchResult').animate({ scrollTop: 300 * page }, 'slow');
                //     page++
                // }

            }
        }
        // it does nothing
        else if (e.keyCode == '37') {
            console.log("left")
        }
        // it does nothing
        else if (e.keyCode == '39') {
            console.log("right")
        }
        // it got executed when enter key is pressed
        else if (e.keyCode == '13') {
            // looking for selected list
            // for (var i = 0; i < $scope.listItems.length; i++) {
            //     if ($($scope.listItems[i]).hasClass("selected")) {
            //         // cheking if that is a child leef
            //         if (!$($scope.listItems[i]).hasClass("child")) {
            //             var valueLink = $($scope.listItems[i]).attr('value')
            //             $scope.gettingSystem(valueLink, 1)
            //         }
            //         else {
            //             var valueLink = $($scope.listItems[i]).attr('value');
            //             var nameLink = $($scope.listItems[i]).attr('name');
            //             $scope.searchClick(valueLink, nameLink)
            //         }

            //     }
            // }
            $scope.schoolPage($scope.indexSearch[count].id)
        }
        // adding selected class 
        $(".searchLink").removeClass("selected")
        $("#list" + $scope.indexSearch[count].id).addClass("selected")
    }
})
$(document).ready(function () {
    myDate();
    function myDate() {
        week = new Array("يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه")
        months = new Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند");
        a = new Date();
        d = a.getDay();
        day = a.getDate();
        month = a.getMonth() + 1;
        year = a.getYear();
        year = (year == 0) ? 2000 : year;
        (year < 1000) ? (year += 1900) : true;
        year -= ((month < 3) || ((month == 3) && (day < 21))) ? 622 : 621;
        switch (month) {
            case 1: (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20); break;
            case 2: (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19); break;
            case 3: (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20); break;
            case 4: (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20); break;
            case 5:
            case 6: (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21); break;
            case 7:
            case 8:
            case 9: (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22); break;
            case 10: (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22); break;
            case 11:
            case 12: (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21); break;
            default: break;
        }

        if (day < 10) {
            $(".myday").css("right", "44%")
        }
        $(".myDay").html(day)
        $(".myMonth").html(months[month - 1])
        $(".myWeek").html(week[d])
    }
})
function appleCheck() {
    if (window.innerWidth < 780 && window.innerWidth > 760) {
       screen.orientation.lock('landscape');
    }
}
appleCheck();
function test() {
    if ($(".unfilter").hasClass("flag")) {
        $(".filter").css("display", "none")
        $(".unfilter").animate({ width: "100%" })
        $(".filter").animate({ width: "0%" })
    }
    else {
        $(".unfilter").animate({ width: "65%" })
        $(".filter").animate({ width: "30%" })
        $(".filter").css("display", "inline-block")
    }
    $(".unfilter").toggleClass("flag")
}