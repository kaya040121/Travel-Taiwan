"use strict";

// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination"
  }
}); // axios 取得全台旅遊景點資料
// console.log(getAuthorizationHeader());

var data = []; // DOM
// index

var popularList = document.querySelector('.js-popularList');
var citySelect = document.querySelector('.js-citySelect');
var categorySelect = document.querySelector('.js-categorySelect');
var search = document.querySelector('.js-search'); // attraction

var list = document.querySelector('.js-list'); // 整理資料 - 景點類別

var ScenicSpotCategory = {};

function getAllScenicSpot() {
  axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/NewTaipei?%24format=JSON', {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    // console.log(response.data);
    var thisData = response.data; // 整理建立類別，並統計各類別數量

    thisData.forEach(function (item) {
      // 濾掉沒有 Class1
      if (item.Class1 === undefined) {
        // console.log("類別為 undefined");
        return;
      } else if (ScenicSpotCategory[item.Class1] === undefined) {
        ScenicSpotCategory[item.Class1] = 1;
      } else {
        ScenicSpotCategory[item.Class1] += 1;
      }
    }); // console.log(ScenicSpotCategory);

    renderCategory();
  })["catch"](function (error) {
    console.log(error);
  });
}

getAllScenicSpot();

function renderCategory() {
  var ScenicSpotCategoryAry = Object.keys(ScenicSpotCategory); // console.log(ScenicSpotCategoryAry);

  var str = "";
  ScenicSpotCategoryAry.forEach(function (item) {
    str += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  var optionAll = "<option selected value=\"\u6240\u6709\u985E\u5225\">\u6240\u6709\u985E\u5225</option>";
  str = optionAll + str; // console.log(str);

  categorySelect.innerHTML = str;
} // index 載入初始化


function init() {
  getTourList();
}

init(); // 取得所有旅遊景點

function getTourList() {
  axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=40&%24format=JSON', {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    console.log(response.data);
    renderScenicSpot(response); // 渲染
  })["catch"](function (error) {
    console.log(error);
  });
} // 渲染景點資訊 - index


function renderScenicSpot(response) {
  data = []; // 清空 data 陣列
  // 將沒有圖片的資料加上預設圖片

  response.data.forEach(function (item) {
    if (item.Picture.PictureUrl1 === undefined) {
      item.Picture.PictureUrl1 = "https://upload.cc/i1/2021/12/03/KirL4h.jpg";
    }

    data.push(item); // 將整理過的資料推入 data 陣列
  }); // 組字串

  var str = "";
  data.forEach(function (item) {
    str += "\n        <li class=\"col-lg-3 mb-18\">\n          <div class=\"card shadow\" style=\"height: 100%;\">\n            <img src=\"".concat(item.Picture.PictureUrl1, "\" class=\"card-img-top\" alt=\"").concat(item.ScenicSpotName, "\">\n            <div class=\"card-body pt-9 pb-7 d-flex flex-column\">\n              <h4 class=\"card-title mb-4 fw-bold me-1\">").concat(item.ScenicSpotName, "</h5>\n                <p class=\"card-text text-info fw-light font-size-xxs mb-1\"><i\n                    class=\"far fa-clock me-1\"></i>").concat(item.OpenTime, "</p>\n                <p class=\"mb-4 text-info fs-5\"><i class=\"fas fa-map-marker-alt text-primary me-1\"></i>").concat(item.Address, "\n                </p>\n                <div class=\"d-grid col-8 mx-auto mt-auto\">\n                  <!-- Button trigger modal -->\n                  <button type=\"button\" class=\"btn btn-outline-primary border-4 fw-bold fs-6 text-nowrap\"\n                    data-bs-toggle=\"modal\" data-bs-target=\"#exampleModal\">\n                    \u4E86\u89E3\u66F4\u591A\n                  </button>\n                </div>\n            </div>\n          </div>\n        </li>        \n        ");
  });
  popularList.innerHTML = str;
} // 監聽篩選景點 - index


search.addEventListener('click', function (e) {
  var city = citySelect.value;
  var category = categorySelect.value;
  console.log(category, city); // https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1,'遊憩類')&%24top=30&%24format=JSON
  // 跳轉至 attraction.html
  // document.location.href = "/attractions.html" + `?city=${city}`;

  if (city == "所有縣市" && category == "所有類別") {
    // 取得所有縣市+所有類別資料
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=40&%24format=JSON", {
      headers: getAuthorizationHeader()
    }).then(function (response) {
      console.log(response.data);
      renderScenicSpot(response);
    })["catch"](function (error) {
      console.log(error);
    });
    return;
  } else if (city == "所有縣市" && category !== "所有類別") {
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1,'".concat(category, "')&%24top=40&%24format=JSON"), {
      headers: getAuthorizationHeader()
    }).then(function (response) {
      console.log(response.data);
      renderScenicSpot(response);
    })["catch"](function (error) {
      console.log(error);
    });
    return;
  } else if (city !== "所有縣市" && category == "所有類別") {
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/".concat(city, "?%24top=40&%24format=JSON"), {
      headers: getAuthorizationHeader()
    }).then(function (response) {
      console.log(response.data);
      renderScenicSpot(response);
    })["catch"](function (error) {
      console.log(error);
    });
    return;
  } else if (city !== "所有縣市" && category !== "所有類別") {
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/".concat(city, "?%24filter=contains(Class1%2C'").concat(category, "')&%24top=40&%24format=JSON"), {
      headers: getAuthorizationHeader()
    }).then(function (response) {
      console.log(response.data);
      renderScenicSpot(response);
    })["catch"](function (error) {
      console.log(error);
    });
    return;
  }
}); // axios.get(
//   'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=30&%24format=JSON',
//   {
//     headers: getAuthorizationHeader()
//   }
// )
//   .then(function (response) {
//     // 將 response.data 渲染文字在 body 標籤，將原本的 JSON 格式轉為字串。
//     // document.querySelector('body').textContent = JSON.stringify(response.data);
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// 驗證

function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  var AppID = '2f697d094fc54340a7c751bfaf561119';
  var AppKey = '4j3yln6jQtVhiggEXxHFHc5yzy0'; //  填入自己 ID、KEY 結束

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return {
    'Authorization': Authorization,
    'X-Date': GMTString
  };
}
//# sourceMappingURL=all.js.map
