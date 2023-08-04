if (!localStorage.getItem("user")) {
  location.replace('./index.html')
}

function fetchVerse() {
  const surahNumber = document.getElementById('surah').value;
  const verseNumber = document.getElementById('ayat').value;
  const editionArabic = 'id.indonasian'; // Indonesian for Arabic
  const editionEnglish = 'en.sahih'; // Sahih International for English
  fetchSurah(surahNumber)
  document.getElementById('disN').innerHTML = verseNumber
  // Fetch Arabic verse
  $.ajax({
    url: `https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/${editionArabic}`,
    method: 'GET',
    success: function (data) {
      const verseArabic = data.data.text;

      $.ajax({
        url: `https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/${editionEnglish}`,
        method: 'GET',
        success: function (data) {
          const verseEnglish = data.data.text;
          document.getElementById("arabicText").innerHTML = verseArabic
          document.getElementById("tranText").innerHTML = verseEnglish
        }
      });
    },
    error: function (error) {
      document.getElementById("arabicText").innerHTML = "<h3>Error Fetching Verse !</h3>"
      document.getElementById("tranText").innerHTML = "<h3>Error Fetching Translation !</h3>"
      document.getElementById('disN').innerHTML = ""
      document.getElementById('surah').value = ""
      fetchSurah(document.getElementById('surah').value)
    }
  });
}
function fetchSurah(surahNumber) {
  $.ajax({
    url: `https://api.alquran.cloud/v1/surah/${surahNumber}`,
    method: 'GET',
    success: function (data) {
      const surahName = data.data.name;
      const surahEnglishName = data.data.englishName;
      $('#sT').html(surahName + ' (' + surahEnglishName + ')');
    },
    error: function (error) {
      console.error('Error fetching Surah information:', error);
      $('#sT').html('<p>Error fetching Surah information.</p>');
    }
  });
}


function handleKeyDown(event) {
  if (event.keyCode === 39) {
    inc()
  } else if (event.keyCode === 37) {
    dec()
  }
}

document.addEventListener("keydown", handleKeyDown);
function inc() {
  let currentSurah = parseInt(document.getElementById("surah").value);
  let currentAyat = parseInt(document.getElementById("ayat").value);

  // If the user has not written anything inside the input fields, set them to 1
  if (isNaN(currentSurah) || currentSurah <= 0) {
    currentSurah = 1;
    document.getElementById("surah").value = currentSurah;
  }

  if (isNaN(currentAyat) || currentAyat <= 0) {
    currentAyat = 1;
    document.getElementById("ayat").value = currentAyat;
  }

  $.ajax({
    url: `https://api.alquran.cloud/v1/surah/${currentSurah}`,
    method: 'GET',
    success: function (data) {
      const totalAyats = data.data.numberOfAyahs;

      if (currentAyat >= totalAyats) {
        document.getElementById("surah").value = currentSurah + 1;
        document.getElementById("ayat").value = 1;
      } else {
        document.getElementById("ayat").value = currentAyat + 1;
      }

      fetchVerse();
    },
    error: function (error) {
      console.error('Error fetching Surah information:', error);
    }
  });
}
function dec() {
  let currentSurah = parseInt(document.getElementById("surah").value);
  let currentAyat = parseInt(document.getElementById("ayat").value);

  if (isNaN(currentSurah) || currentSurah <= 0) {
    currentSurah = 1;
    document.getElementById("surah").value = currentSurah;
  }

  if (isNaN(currentAyat) || currentAyat <= 0) {
    currentAyat = 1;
    document.getElementById("ayat").value = currentAyat;
  }

  $.ajax({
    url: `https://api.alquran.cloud/v1/surah/${currentSurah}`,
    method: 'GET',
    success: function (data) {
      const totalAyats = data.data.numberOfAyahs;

      if (currentAyat === 1) {
        if (currentSurah === 1) {
          return;
        } else {
          $.ajax({
            url: `https://api.alquran.cloud/v1/surah/${currentSurah - 1}`,
            method: 'GET',
            success: function (prevSurahData) {
              const prevTotalAyats = prevSurahData.data.numberOfAyahs;
              document.getElementById("surah").value = currentSurah - 1;
              document.getElementById("ayat").value = prevTotalAyats;
              fetchVerse();
            },
            error: function (error) {
              console.error('Error fetching Surah information:', error);
            }
          });
        }
      } else {
        document.getElementById("ayat").value = currentAyat - 1;
        fetchVerse();
      }
    },
    error: function (error) {
      console.error('Error fetching Surah information:', error);
    }
  });
}








function fetchAllSurahs() {
  $.ajax({
    url: `https://api.alquran.cloud/v1/surah`,
    method: 'GET',
    success: function (data) {
      const surahs = data.data;
      const selectElement = document.getElementById('ss');

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.text = 'SELECT SURAH BY NAME';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);

      surahs.forEach((surah) => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.text = `${surah.number}. ${surah.name} (${surah.englishName})`;
        selectElement.appendChild(option);
      });
    },
    error: function (error) {
      console.error('Error fetching Surah list:', error);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchAllSurahs();

  document.getElementById('ss').addEventListener('change', function () {
    const selectedSurahNumber = this.value;
    document.getElementById('surah').value = selectedSurahNumber;
    document.getElementById('ayat').value = 1;
    fetchVerse()
    blurSurahInput()
  });
});





function fetchAllSurahsSearch() {
  $.ajax({
    url: `https://api.alquran.cloud/v1/surah`,
    method: 'GET',
    success: function (data) {
      const surahs = data.data;
      const selectElement = document.getElementById('sss');

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.text = 'Search Surah by Name';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);

      surahs.forEach((surah) => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.text = `${surah.name}`;
        selectElement.appendChild(option);
      });
    },
    error: function (error) {
      console.error('Error fetching Surah list:', error);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchAllSurahsSearch();

  document.getElementById('sss').addEventListener('change', function () {
    const selectedSurahNumber = this.value;
    document.getElementById('surah').value = selectedSurahNumber;
    document.getElementById('ayat').value = 1;
    fetchVerse()
    blurSurahInput()
  });
});
function blurSurahInput() {
  const surahInput = document.getElementById('surah');
  surahInput.blur = true;
}
