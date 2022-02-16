// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
  },
});


// axios 取得全台旅遊景點資料
// console.log(getAuthorizationHeader());

let data = [];

// DOM
// index
const popularList = document.querySelector('.js-popularList');
const citySelect = document.querySelector('.js-citySelect');
const categorySelect = document.querySelector('.js-categorySelect');
const search = document.querySelector('.js-search');
// attraction
const list = document.querySelector('.js-list');

// 整理資料 - 景點類別
const ScenicSpotCategory = {};
function getAllScenicSpot() {
  axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/NewTaipei?%24format=JSON', {
    headers: getAuthorizationHeader()
  })
    .then(function (response) {
      // console.log(response.data);
      let thisData = response.data;
      // 整理建立類別，並統計各類別數量
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
      })
      // console.log(ScenicSpotCategory);
      renderCategory();
    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllScenicSpot();

function renderCategory() {
  const ScenicSpotCategoryAry = Object.keys(ScenicSpotCategory);
  // console.log(ScenicSpotCategoryAry);
  let str = "";
  ScenicSpotCategoryAry.forEach(function (item) {
    str += `<option value="${item}">${item}</option>`;
  })
  let optionAll = `<option selected value="所有類別">所有類別</option>`;
  str = optionAll + str;
  // console.log(str);
  categorySelect.innerHTML = str;
}

// index 載入初始化
function init() {
  getTourList();
}
init();

// 取得所有旅遊景點
function getTourList() {
  axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=40&%24format=JSON', {
    headers: getAuthorizationHeader()
  })
    .then(function (response) {
      console.log(response.data);
      renderScenicSpot(response); // 渲染
    })
    .catch(function (error) {
      console.log(error);
    })
}

// 渲染景點資訊 - index
function renderScenicSpot(response) {
  data = []; // 清空 data 陣列
  // 將沒有圖片的資料加上預設圖片
  response.data.forEach(function (item) {
    if (item.Picture.PictureUrl1 === undefined) {
      item.Picture.PictureUrl1 = "https://upload.cc/i1/2021/12/03/KirL4h.jpg";
    }
    data.push(item); // 將整理過的資料推入 data 陣列
  })
  // 組字串
  let str = "";
  data.forEach(function (item) {
    str += `
        <li class="col-lg-3 mb-18">
          <div class="card shadow" style="height: 100%;">
            <img src="${item.Picture.PictureUrl1}" class="card-img-top" alt="${item.ScenicSpotName}">
            <div class="card-body pt-9 pb-7 d-flex flex-column">
              <h4 class="card-title mb-4 fw-bold me-1">${item.ScenicSpotName}</h5>
                <p class="card-text text-info fw-light font-size-xxs mb-1"><i
                    class="far fa-clock me-1"></i>${item.OpenTime}</p>
                <p class="mb-4 text-info fs-5"><i class="fas fa-map-marker-alt text-primary me-1"></i>${item.Address}
                </p>
                <div class="d-grid col-8 mx-auto mt-auto">
                  <!-- Button trigger modal -->
                  <button type="button" class="btn btn-outline-primary border-4 fw-bold fs-6 text-nowrap"
                    data-bs-toggle="modal" data-bs-target="#exampleModal">
                    了解更多
                  </button>
                </div>
            </div>
          </div>
        </li>        
        `;
  })
  popularList.innerHTML = str;
}

// 監聽篩選景點 - index
search.addEventListener('click', function (e) {
  const city = citySelect.value;
  const category = categorySelect.value;
  console.log(category, city);
  // https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1,'遊憩類')&%24top=30&%24format=JSON
  // 跳轉至 attraction.html
  // document.location.href = "/attractions.html" + `?city=${city}`;
  if (city == "所有縣市" && category == "所有類別") {
    // 取得所有縣市+所有類別資料
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=40&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        console.log(response.data);
        renderScenicSpot(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    return;
  }
  else if (city == "所有縣市" && category !== "所有類別") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1,'${category}')&%24top=40&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        console.log(response.data);
        renderScenicSpot(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    return;
  }
  else if (city !== "所有縣市" && category == "所有類別") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${city}?%24top=40&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        console.log(response.data);
        renderScenicSpot(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    return;
  }
  else if (city !== "所有縣市" && category !== "所有類別") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${city}?%24filter=contains(Class1%2C'${category}')&%24top=40&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        console.log(response.data);
        renderScenicSpot(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    return;
  }
})














// axios.get(
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
  let AppID = '2f697d094fc54340a7c751bfaf561119';
  let AppKey = '4j3yln6jQtVhiggEXxHFHc5yzy0';
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

