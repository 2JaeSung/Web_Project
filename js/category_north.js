var hospi_list = null;

// list of emergency room website
var str = "https://www.e-gen.or.kr/nemc/location.do?locationType=I, https://dswhosp.co.kr/main/main.php, http://www.hwahonghospital.com/, https://bundang.chamc.co.kr/, http://www.schosp.co.kr/sub/main.php?device=, https://www.scmc.kr/, https://www.cmcbucheon.or.kr/page/main, http://www.danielhospital.com/, https://hallym.hallym.or.kr/, https://www.handoh.com/handoh/main/, https://www.dwhosp.co.kr/, http://www.yishospital.com/, http://www.ptsm.co.kr/, https://www.parkmedical.co.kr/main/main.asp, https://www.shhosp.co.kr/, https://www.cmch.co.kr/new/main/index.php, https://gsamhospital.com/, http://hjhospital.co.kr/, http://www.nyds.co.kr/, https://nkhospital.net/, https://www.medical.or.kr/ansung/index.do, http://www.oshankook.net/, http://www.ypghosp.co.kr/, https://www.mjh.or.kr/, https://www.nhimc.or.kr/index.do, https://www.paik.ac.kr/ilsan/user/doctor/view.do?doctorId=814, http://www.dumc.or.kr/index00.jsp, https://ilsan.chamc.co.kr/, https://www.medical.or.kr/uijeongbu/index.do, http://www.uemc.ac.kr/index.jsp?pc=pc, http://hdgh.co.kr/, https://guri.hyumc.com/guri/main.do, https://www.medical.or.kr/paju/index.do, http://www.swoori.co.kr/, http://hosp.ajoumc.or.kr/, https://www.cmcvincent.or.kr/page/main, https://www.medical.or.kr/suwon/index.do, https://www.snubh.org/index.do, https://www.dmc.or.kr/, https://afmd.mnd.go.kr/mbshome/mbs/afmd/, http://www.chungsh.com/, https://www.schmc.ac.kr/bucheon/index.do, https://bucheonsjh.co.kr/, https://www.samhospital.com/, http://ansan.kumc.or.kr/main/index.do, https://www.comwel.or.kr/ansan/index.jsp, http://www.davoshospital.co.kr/, http://www.knmc.or.kr/main/main.php, https://sev.severance.healthcare/yi/intro.do, https://www.goodmhospital.co.kr/main/, http://www.bagaehospital.com/, https://h.ksungae.co.kr/index.do, https://suh.or.kr/main.html, https://www.wmcsb.co.kr/, https://dongtan.hallym.or.kr/, http://wkgh.co.kr/, https://chamhosp.co.kr/, https://www.gwhospital.co.kr/main/, https://medical.or.kr/icheon/index.do, http://ansmc.co.kr/sm2018/, http://sjyj.co.kr/web/, https://www.ncc.re.kr/, https://www.cmcujb.or.kr/page/main, http://upaik.co.kr/index.asp, http://www.choomc.com/, https://www.hynyj.co.kr/contents/intro/intro.html, https://nanumnyj.co.kr/, https://www.medical.or.kr/pocheon/index.do, https://www.yeoncheon.go.kr/health/index.do"
const hospi_address = str.split(', ');

// list of emergency room english name
var english_name = [
     "Gyeonggi Emergency Medical Support Center",
     "East Suwon Hospital",
     "Myeongin Medical Foundation Hwahong Hospital",
     "CHA Bundang Hospital",
     "Seongnam Central Hospital",
     "Seongnam Medical Center",
     "The Catholic University of Korea Bucheon St. Mary's Hospital",
     "Daniel General Hospital",
     "Hallym University Sacred Heart Hospital",
     "Hando Hospital",
     "Donguiseongdanwon Hospital",
     "Hyosim Medical Foundation Yongin Seoul Hospital",
     "Pyeongtaek St. Mary's Hospital",
     "Park Hospital",
     "Sihwa Hospital",
     "Central Hospital",
     "G-Sam Hospital",
     "Hwaseong Central General Hospital",
     "Hwaseong DS Hospital",
     "New Korea Hospital",
     "Gyeonggi Provincial Medical Center Anseong Hospital",
     "Osan Korea Hospital",
     "Yangpyeong Hospital",
     "Myongji Hospital",
     "National Health Insurance Corporation Ilsan Hospital",
     "Inje University Ilsan Paik Hospital",
     "Dongguk University Ilsan Buddhist Hospital",
     "Ilsan Cha Hospital",
     "Gyeonggi Provincial Medical Center Uijeongbu Hospital",
     "Eulji University Hospital",
     "Modern Hospital",
     "Hanyang Daegu Guri Hospital",
     "Gyeonggi Provincial Medical Center Paju Hospital",
     "Medical Corporation Ilsim Medical Foundation Woori Hospital",
     "Ajou University Hospital",
     "St. Vincent's Hospital",
     "Gyeonggi Provincial Medical Center Suwon Hospital",
     "Seoul National University Bundang Hospital",
     "Bundang Jesaeng Hospital",
     "Army Capital Hospital",
     "Jeong Hospital",
     "Soonchunhyang University Bucheon Hospital",
     "Sejong Hospital",
     "Anyangseam Hospital",
     "Korea University Ansan Hospital",
     "Labor Welfare Corporation Ansan Hospital",
     "Davos Hospital",
     "Gangnam Hospital",
     "Yongin Severance Hospital",
     "Good Morning Hospital",
     "Park Ae Hospital",
     "Gwangmyeong Sungae Hospital",
     "Shincheon Union Hospital",
     "Wonkwang University Sanbon Hospital",
     "Hallym University Dongtan Sacred Heart Hospital",
     "(Foundation) Wonbuddhist Wonkwang General Hospital",
     "Cham Jo Eun Hospital",
     "Gimpo Woori Hospital",
     "Gyeonggi Provincial Medical Center Icheon Hospital",
     "Anseong St. Mary's Hospital",
     "Sejong Yeoju Hospital",
     "National Cancer Center",
     "Catholic University St. Mary's Hospital",
     "Uijeongbu Paik Hospital",
     "Chu Hospital",
     "Namyangju Hanyang Hospital",
     "Namyangju Nanum Hospital",
     "Gyeonggi Provincial Medical Center Pocheon Hospital",
     "Yeoncheon-gun Health and Medical Center"
]
// count category items
var count = 0;

// Communication to use Restful API
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var obj=JSON.parse(this.responseText);
    // parsing
    hospi_list = obj.EmgncyMedcareInstStus[1].row;

    for(var i =0;i < hospi_list.length;i++){
      // made new html element
      if(hospi_list[i].REFINE_WGS84_LAT >= 37.6){
        count++;
        var div = document.createElement('div');
        div.className = 'flex_title';
        div.setAttribute("onclick", "location.href='" + hospi_address[i] + "'");

        var emergency = document.createElement('i');
        emergency.id = 'title_icon';
        emergency.innerHTML = '<i class="fas fa-ambulance fa-2x"></i>';

        var title = document.createElement('h3');
        title.id = 'element_title';
        title.innerHTML = english_name[i] +"(" + hospi_list[i].HOSPTL_CENTER_NM + ")";

        div.appendChild(emergency);
        div.appendChild(title);
        document.body.querySelector('.start').appendChild(div);


        var div1 = document.createElement('div1');
        div1.className = 'flex_element';
        div1.setAttribute("onclick", "location.href='" + hospi_address[i] + "'");

        var map = document.createElement('i');
        map.id = 'address_icon';
        map.innerHTML = '<i class="fas fa-map-marked-alt"></i>';

        var address = document.createElement('h4');
        address.id = 'element_address';
        address.innerHTML = "Address : " + hospi_list[i].REFINE_ROADNM_ADDR;

        div1.appendChild(map);
        div1.appendChild(address);
        document.body.querySelector('.start').appendChild(div1);


        var div2 = document.createElement('div2');
        div2.className = 'flex_last';
        div2.setAttribute("onclick", "location.href='" + hospi_address[i] + "'");

        var p = document.createElement('i');
        p.id = 'phone_icon';
        p.innerHTML = '<i class="fas fa-phone"></i>';

        var phone = document.createElement('h4');
        phone.id = 'element_phone';
        phone.innerHTML = "Telephone number : " + hospi_list[i].REPRSNT_TELNO;

        div2.appendChild(p);
        div2.appendChild(phone);
        document.body.querySelector('.start').appendChild(div2);
      }
    }
    // show number of items
    $("h5").text(count+' results in "Northern" Gyeonggi Province')

  }
};



// GET request
xhttp.open("GET", "https://openapi.gg.go.kr/EmgncyMedcareInstStus?Key=a016e5b035bb4692ba086980bec59911&Type=Json", true);
//xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send();
