/* ========================================
Тест по темпористике
Автор методики: Александр Латышев <http://vk.com/mozgosteb>
Автор программной реализации: 4X_Pro <admin@openproj.ru>
(c) 2012, Единый Типологический Проект (TYPOLOGIES.RU)

При размещении теста на своем сайте необходимо разместить гиперссылки на сайт автора теста (http://темпористика.рф) и сайт разработчика (http://typologies.ru). 
=========================================== */

var timerInterval; //вынесем ссылку на таймер как внешнюю перменную что бы при заврешении теста вырубить таймер, отсановить его запустив функцию clearInterval(timerInterval) иначе будем считать бесконечно

/* Впишиваем таймер в тег с ID дишником demo */
function showTimer() {
    var currentTimeInSecondsFixed = new Date(); //фиксируем текущее время от которого будещ чистать пройденное время

    // Обновляем таймер кажду секунду setInterval(function(){...},1000);
    timerInterval = setInterval(function() {

        // Get today's date and time
        var secondsFrom1January1970in000000UTC = new Date().getTime(); //Значение, возвращённое методом getTime(), является количеством миллисекунд, прошедших с 1 января 1970 года 00:00:00 по UTC.

        // Расстояние между фикированым временим и то что накапало c 1 января 1970 года в миллисекундах.
        var secondsBetween1January1970in000000UTCandCurrentFixedTime = secondsFrom1January1970in000000UTC - currentTimeInSecondsFixed;

        // Лень искать формулы перевода из миллисекунд в дни, часы
        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((secondsBetween1January1970in000000UTCandCurrentFixedTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((secondsBetween1January1970in000000UTCandCurrentFixedTime % (1000 * 60)) / 1000);

        // Обновляем наш элемент id demo новыми минутами секундами)
        document.getElementById("demo").innerHTML = "Время:" +
            minutes + "минут " + seconds + "секунд ";

    }, 1000); //Задержка перед запуском в миллисекундах (1000 мс = 1 с). Значение по умолчанию – 0. НЕЗАБЫТЬ где-то запустить clearInterval(timerInterval) иначе интервал наш будет бесконечный пока закладку не закороем.
}

+

function(testElement, descriptionElement, onFinish) {
    /* =============== ОБЩАЯ ЧАСТЬ ВСЕХ ТЕСТОВ ====================*/
    var questionsCounter = 0;
    var typesWeights = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // результаты будут массивом из 24 элементов ("веса" для каждого из типов)
    var hash_flag = true;
    var class_name = 'tmpr';

    function showQuestion(question) { // вывод вопроса. Не путать questions это массив объектов с вопросами, а question это конретный номреной вопрос
        if (startButton.style.display != 'none') startButton.style.display = 'none'; //отлючаем отображение кнопкки запуска теста
        //Формирует тег P и элемент тег progress b тег биг
        var html = '<p>Вопрос №' + (questionsCounter + 1) + ' из ' + questions.length + ' <progress value="' + (questionsCounter) + '" max="' + questions.length + '"></progress></p>';
        html += '<big>' + question.text + '</big><br>'; // выводим текст вопроса
        for (key in question.answers) { // для каждого ответа впихиваем input radio
            html += '<label><input type="radio" name="answer" value="' + key + '" onclick="this.form.onsubmit()"/> ' + (parseInt(key) + 1) + ') ' + question.answers[key] + '</label>';
        }
        fade_in();
        innerElement.innerHTML = html;
    }

    var key_string = 'ploikjuyhgtrfdewsaqzxcvbnm1234567890PLOIKJUYHGTRFDEWSAQZXCVBNM'; // строка для кодирования результатов теста в хеше (62 символа) изощренный способ хранения результата

    function encryptNumber(number) {
        if (number < 0 || number > key_string.length) { //если число меньше нуля или чилсо больше длины key_sting
            alert('Ошибка кодирования, слишком большое значение ' + number);
            return '';
        } else return key_string.charAt(number); //Метод charAt() "что под этим номером" возвращает указанный номером (от 0) символ из строки. Если 0 вернет p, если 1 то вернет l, если 2 то o (оу)
    }

    function decryptNumber(char) {
        return key_string.indexOf(char); //Метод indexOf() "скажи мне номер элемента" возвращает первый индекс, по которому данный элемент может быть найден в массиве или -1, если такого индекса нет.
    }

    /*Передаем врапер, какую-то валую, перебераем все инпуты если инупское валуе равное валую переданому то мы этот инпут выкидываем тому кто вызвал это функцию иначе нулл*/
    function getInputWithValue(wrapper, value) {
        var inputs = wrapper.getElementsByTagName("input");
        var i = inputs.length;
        while (i--) {
            if (inputs[i].value === value) {
                return inputs[i];
            }
        }
        return null;
    }

    function startTest() { // сбрасываем результаты предыдущего прохождеия теста и счетчик вопросов
        if (descriptionElement && descriptionElement.style) {
            descriptionElement.style.display = 'none'
        } // скрываем вводный текст, если указан элемент с ним
        if (!decodeHash()) { // если не удалось извлечь из хеша данные о том, откуда продолжить, начинаем сначала
            questionsCounter = 0; // обнуляем\инциализируем номер текущего вопроса
            for (i = 0; i < 24; i++) typesWeights[i] = 0; // обнуляем наш 24 элементный массив весов   
            document.location.hash = ''; //обнуляем\очищаем хеш 
        }
        showQuestion(questions[questionsCounter]); //показываем вопрос из массива объектов, конкретный объект вопроса
        //Обработка быстры клавишь 1 2 3 на ответах
        document.onkeyup = function(e) {
            var wrapper = document.getElementsByClassName(class_name)[0];
            if (e.which == 49) {
                getInputWithValue(wrapper, "0").checked = true;
                nextQuestion();
            } else if (e.which == 50) {
                getInputWithValue(wrapper, "1").checked = true;
                nextQuestion();
            } else if (e.which == 51) {
                getInputWithValue(wrapper, "2").checked = true;
                nextQuestion();
            }
        };
        showTimer();
    }

    function nextQuestion() { // переход к следующему вопросу
        var answer_id = -1; //зачем это answer_id нужне, почему -1, цифравая отрицальная затычка если все пойдет не полану, не одно улсовие не выоплниться.
        for (i = 0; i < testForm.elements.length; i++) { // обходим все элементы формы, чтобы проверить radiobuttons с ответами
            if (testForm.elements[i].name == 'answer' && testForm.elements[i].checked == true) answer_id = testForm.elements[i].value; // если текущий radiobutton выбраный то его значение value (0,1,2) сохраняем answer_id 
        }
        var next_id = questions[questionsCounter].onanswer(answer_id); //из массива question определенный вопрос и вызываем метод объекта onaswer передаем туда value выбраного input(а)
        //onaswer начинает забивать наш масси результс
        if (!next_id) { //если функция onanswer вернула что-то плохое, просто увлеичиваем каутер на единицу.
            next_id = questionsCounter + 1;
        }
        questionsCounter = next_id; //непомнятно что может вернуть функция onanswer
        if (questionsCounter == -1 || questionsCounter >= questions.length) { // если функция onanswer вернула -1 или вопросы кончились, выдаем результат теста    
            calculate_result();
            fade_in();
            show_result();
            startButton.style.display = ''; //показываем кнопку старта я так понимаю имеет ввиду что по умолчанию отображать элемент, если ничего не указано.
            if (onFinish) onFinish(); // выполняем функцию-обработчик завершения теста
        } else { // иначе задаем следующий вопрос
            showQuestion(questions[questionsCounter]);
        }
        hash_flag = false; // временно блокируем обработчик хешей, чтобы не выполнять лишних действий
        document.location.hash = encode_hash();
        hash_flag = true;
        return false; // нужно, чтобы не происходило обновление страницы в результате отправки формы
    }

    function fade_in() { // "всплывающий" показ вопроса
        testElement.style.opacity = 0.0;
        var si = setInterval(function() {
            var alpha = parseFloat(testElement.style.opacity) + 0.05;
            testElement.style.opacity = alpha;
            if (alpha >= 1) clearInterval(si);
        }, 125);
    }

    /* ========= ЗДЕСЬ НАЧИНАЕТСЯ ТЕСТ-ЗАВИСИМАЯ ЧАСТЬ ================*/
    var answers = {
        '0': 'Скорее Да',
        '1': 'Не знаю/Не важно',
        '2': 'Скорее Нет'
    };
    var typenames = ['ПНБВ', 'ПНВБ', 'ПВНБ', 'ПВБН', 'ПБВН', 'ПБНВ', 'НПБВ', 'НПВБ', 'НВПБ', 'НВБП', 'НБПВ', 'НБВП', 'БПНВ', 'БПВН', 'БВНП', 'БВПН', 'БНВП', 'БНПВ', 'ВПНБ', 'ВПБН', 'ВНПБ', 'ВНБП', 'ВБПН', 'ВБНП'];

    function fn_answer(answer_data) { // обработчик для прямого ответа
        return function(answer_id) { // здесь используем замыкание, чтобы не генерировать много похожих функций
                var masks = answer_data[answer_id].masks; // у ответа 0, 1 ,2 есть маска
                var weight = answer_data[answer_id].weight; // и вес
                var subResults = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (n = 0; n < masks.length; n++) { // для всех масок определяем номера типов и для соответствующих типов плюсуем вес к результатам
                    //		console.log(n + ' in ' + masks.length);
                    //		console.log(masks[n] + ' in ' + masks.length);
                    var types = mask_match(masks[n]);
                    for (j = 0; j < types.length; j++) subResults[types[j]] = 1;
                    //		console.log(n + ' in ' + masks.length);
                }
                for (k = 0; k < subResults.length; k++) {
                    typesWeights[k] = typesWeights[k] + subResults[k] * weight //1+1*вес
                }
                //	console.log(results);
            } // помещаем ответ в соответствующий элемент массива
    }

    function mask_match(mask) {
        var inverse = false; //булевой флажок зачемто
        if (mask[0] == '!') { // если в маске попадается восклицательный знак
            inverse = true; //булевой флажок инферсси переключаем
            mask = mask.substr(1); //и все последующие после восклицательного знака сиволы маски сохраняем в переменную mask
        }
        var res = []; //сюда будет запихивать, пушить типы которые совпадю по маске и будет его и возвращать этот массив с запушеными масками
        for (i = 0; i < typenames.length; i++) { //перебераем массив строк типов
            var matched = true; //булевой флажок переключаем в труе (имеет ли смысл задерживаться на типе или нет)
            for (j = 0; j < mask.length && matched; j++) matched = matched && (mask[j] == typenames[i][j] || mask[j] == '*') //оставляем матчет в тру или нет 
            if (matched != inverse) res.push(i);
        }
        return res;
    }
    //Самый главый массим обеъктов с вопросами весами
    var questions = [
        //     {
        //     text: 'Я ненавижу конкурировать ',
        //     answers: answers,
        //     onanswer: fn_answer({
        //         '0': {
        //             weight: 0.8,
        //             masks: ['**Н*', '**П*']
        //         },
        //         '1': {
        //             weight: 0.8,
        //             masks: ['**Б*', '**В*']
        //         },
        //         '2': {
        //             weight: 0.8,
        //             masks: ['**Б*', '**В*']
        //         }
        //     })
        // },
        {
            text: 'Время все расставит по местам ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: []
                },
                '1': {
                    weight: 1.5,
                    masks: ['!*Б**']
                },
                '2': {
                    weight: 1.5,
                    masks: ['!*Б**']
                }
            })
        }, {
            text: 'Мне ничего не стоит вникнуть в чужой замысел и дополнить его ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.133333333333332,
                    masks: ['Б***', 'В***', '*В**', '*Б**']
                },
                '1': {
                    weight: 0.133333333333332,
                    masks: []
                },
                '2': {
                    weight: 0.133333333333332,
                    masks: ['ПН**', 'НП**']
                }
            })
        }, {
            text: 'Я не могу придти в гости без приглашения ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: []
                },
                '1': {
                    weight: 1.5,
                    masks: []
                },
                '2': {
                    weight: 1.5,
                    masks: ['!**Н*']
                }
            })
        }, {
            text: 'Я принимаю решения под влиянием момента ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.4,
                    masks: ['Н***', '*Н**']
                },
                '1': {
                    weight: 0.4,
                    masks: ['**Н*', '***Н']
                },
                '2': {
                    weight: 0.4,
                    masks: ['**Н*', '***Н']
                }
            })
        }, {
            text: 'В прошлом слишком много неприятных воспоминаний, я предпочитаю не думать о них. ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['!***П']
                },
                '1': {
                    weight: 0.5,
                    masks: ['!**П*']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!**П*']
                }
            })
        }, {
            text: 'Я хорошо понимаю кто я такой(ая)',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.2,
                    masks: ['П***', '*П**']
                },
                '1': {
                    weight: 1.2,
                    masks: ['**П*', '***П']
                },
                '2': {
                    weight: 1.2,
                    masks: ['**П*', '***П']
                }
            })
        }, {
            text: 'Жизнь без приключений — ничто ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['!***П']
                },
                '1': {
                    weight: 0.5,
                    masks: []
                },
                '2': {
                    weight: 0.5,
                    masks: ['!П***']
                }
            })
        }, {
            text: 'У меня почти всегда есть план ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.7,
                    masks: ['Б***']
                },
                '1': {
                    weight: 0.7,
                    masks: ['!Б***']
                },
                '2': {
                    weight: 0.7,
                    masks: ['!Б***']
                }
            })
        }, {
            text: 'Абсурд - это весело ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.7,
                    masks: ['!**В*']
                },
                '1': {
                    weight: 0.7,
                    masks: ['**В*', '***В']
                },
                '2': {
                    weight: 0.7,
                    masks: []
                }
            })
        }, {
            text: 'Счастливые воспоминания легко приходят в голову ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['!**П*']
                },
                '1': {
                    weight: 0.5,
                    masks: []
                },
                '2': {
                    weight: 0.5,
                    masks: []
                }
            })
        }, {
            text: 'Удача дает больше чем упорная работа ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.75,
                    masks: ['*Н**']
                },
                '1': {
                    weight: 0.75,
                    masks: []
                },
                '2': {
                    weight: 0.75,
                    masks: ['!*Н**']
                }
            })
        }, {
            text: 'Бездействие меня нервирует ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['Б***']
                },
                '1': {
                    weight: 0.5,
                    masks: []
                },
                '2': {
                    weight: 0.5,
                    masks: []
                }
            })
        }, {
            text: 'Обожаю английский юмор ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.25,
                    masks: ['В***', '*В**']
                },
                '1': {
                    weight: 1.25,
                    masks: []
                },
                '2': {
                    weight: 1.25,
                    masks: ['**В*', '***В']
                }
            })
        }, {
            text: 'Мои “скелеты в шкафу” вряд ли кому-нибудь интересны ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: []
                },
                '1': {
                    weight: 0.5,
                    masks: ['!***П']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!***П']
                }
            })
        }, {
            text: 'Когда у меня есть цель, то все что к ней не относится перестает быть интересным ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.2,
                    masks: ['БП**', 'Б*П*', 'Б**П', '*БП*', '*Б*П', '**БП']
                },
                '1': {
                    weight: 1.2,
                    masks: []
                },
                '2': {
                    weight: 1.2,
                    masks: ['ПБ**', 'П*Б*', 'П**Б', '*ПБ*', '*П*Б', '**ПБ']
                }
            })
        }, {
            text: 'Занимаясь чем-то я часто забываю про время ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: []
                },
                '1': {
                    weight: 1.5,
                    masks: ['**Н*', '***Н']
                },
                '2': {
                    weight: 1.5,
                    masks: ['**Н*', '***Н']
                }
            })
        }, {
            text: 'Когда я не знаю что обо мне думают, меня это совершенно не волнует ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.666666666666667,
                    masks: ['*П**', '***П']
                },
                '1': {
                    weight: 0.666666666666667,
                    masks: []
                },
                '2': {
                    weight: 0.666666666666667,
                    masks: ['П***', '**П*']
                }
            })
        }, {
            text: 'В идеале, хорошо было бы проживать каждый день как последний ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1,
                    masks: ['Н***']
                },
                '1': {
                    weight: 1,
                    masks: []
                },
                '2': {
                    weight: 1,
                    masks: []
                }
            })
        }, {
            text: 'Мне трудно сориентироваться в незнакомом месте ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.8,
                    masks: ['**Н*', '***Н']
                },
                '1': {
                    weight: 0.8,
                    masks: []
                },
                '2': {
                    weight: 0.8,
                    masks: ['Н***', '*Н**']
                }
            })
        }, {
            text: 'Все слишком изменчиво чтобы можно было планировать свое будущее ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.25,
                    masks: ['**Б*', '***Б']
                },
                '1': {
                    weight: 1.25,
                    masks: []
                },
                '2': {
                    weight: 1.25,
                    masks: ['Б***', '*Б**']
                }
            })
        }, {
            text: 'В моем лице есть что-то детское ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: []
                },
                '1': {
                    weight: 0.5,
                    masks: ['!**П*']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!**П*']
                }
            })
        }, {
            text: 'Мне нравится скорее принимать гостей, нежели ходить в гости ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.25,
                    masks: ['Н***', '**Н*']
                },
                '1': {
                    weight: 1.25,
                    masks: []
                },
                '2': {
                    weight: 1.25,
                    masks: ['*Н**', '***Н']
                }
            })
        }, {
            text: 'Изучая что-то новое, я часто вижу скрытые закономерности, о которых нигде не говорится ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.8,
                    masks: ['В***', '*В**']
                },
                '1': {
                    weight: 0.8,
                    masks: ['**В*', '***В']
                },
                '2': {
                    weight: 0.8,
                    masks: ['**В*', '***В']
                }
            })
        }, {
            text: 'Я легче чем многие переношу скуку ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1,
                    masks: []
                },
                '1': {
                    weight: 1,
                    masks: []
                },
                '2': {
                    weight: 1,
                    masks: ['!***Н']
                }
            })
        }, {
            text: 'Коллекционирование - интереснейшее занятие ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['П***', '*П**']
                },
                '1': {
                    weight: 0.5,
                    masks: ['!П***']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!П***']
                }
            })
        }, {
            text: 'Я далеко не всегда могу сказать зачем я делаю те или иные вещи ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.8,
                    masks: ['**В*', '***В']
                },
                '1': {
                    weight: 0.8,
                    masks: []
                },
                '2': {
                    weight: 0.8,
                    masks: ['В***', '*В**']
                }
            })
        }, {
            text: 'Много раз я начинал(а) дела к котором, в итоге, оказывался(ась) совершенно неспособным ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.7,
                    masks: ['***Б']
                },
                '1': {
                    weight: 0.7,
                    masks: []
                },
                '2': {
                    weight: 0.7,
                    masks: ['!***Б']
                }
            })
        }, {
            text: 'Придя в новый коллектив, я быстро становлюсь своим ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: ['*Н**']
                },
                '1': {
                    weight: 1.5,
                    masks: ['*Н**', '***Н']
                },
                '2': {
                    weight: 1.5,
                    masks: []
                }
            })
        }, {
            text: 'Я воспринимаю мир не так ярко и живо как большинство моих знакомых ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: []
                },
                '1': {
                    weight: 0.5,
                    masks: ['!***Н']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!***Н']
                }
            })
        }, {
            text: 'Мне легче говорить о вещах, которые не касаются меня лично ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.4,
                    masks: ['ВП**', 'В*П*', 'В**П', '*ВП*', '*В*П', '**ВП']
                },
                '1': {
                    weight: 0.4,
                    masks: ['**В*', '***В']
                },
                '2': {
                    weight: 0.4,
                    masks: ['ПВ**', 'П*В*', 'П**В', '*ПВ*', '*П*В', '**ПВ']
                }
            })
        }, {
            text: 'Я принимаю каждый день, каков он есть, не пытаясь планировать его заранее ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.2,
                    masks: ['НБ**', 'Н*Б*', 'Н**Б', '*НБ*', '*Н*Б', '**НБ']
                },
                '1': {
                    weight: 1.2,
                    masks: []
                },
                '2': {
                    weight: 1.2,
                    masks: ['БН**', 'Б*Н*', 'Б**Н', '*БН*', '*Б*Н', '**БН']
                }
            })
        }, {
            text: 'Импровизация - явно не мой жанр ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.4,
                    masks: ['**Н*', '***Н']
                },
                '1': {
                    weight: 0.4,
                    masks: ['**Н*', '***Н']
                },
                '2': {
                    weight: 0.4,
                    masks: ['Н***', '*Н**']
                }
            })
        }, {
            text: 'Знания не бывают лишними ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.1,
                    masks: ['П***']
                },
                '1': {
                    weight: 0.1,
                    masks: ['!П***']
                },
                '2': {
                    weight: 0.1,
                    masks: ['!П***']
                }
            })
        }, {
            text: 'Процесс перестает приносить мне удовольствие, если приходится думать о цели, последствиях и практических результатах ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.333333333333333,
                    masks: ['**Б*', '***Б']
                },
                '1': {
                    weight: 1.333333333333333,
                    masks: []
                },
                '2': {
                    weight: 1.333333333333333,
                    masks: ['Б***', '*Б**']
                }
            })
        }, {
            text: 'Мои успехи редко видны со стороны ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1,
                    masks: ['ПБ**', 'БП**']
                },
                '1': {
                    weight: 1,
                    masks: []
                },
                '2': {
                    weight: 1,
                    masks: []
                }
            })
        }, {
            text: 'Когда сразу несколько вещей требует внимания - я теряюсь ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.1,
                    masks: ['***Н']
                },
                '1': {
                    weight: 0.1,
                    masks: ['!***Н']
                },
                '2': {
                    weight: 0.1,
                    masks: ['!***Н']
                }
            })
        }, {
            text: 'Мне приятно думать о прошлом ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.666666666666667,
                    masks: []
                },
                '1': {
                    weight: 0.666666666666667,
                    masks: []
                },
                '2': {
                    weight: 0.666666666666667,
                    masks: ['П***', '**П*']
                }
            })
        }, {
            text: 'Я часто ощущаю себя лишним, ненужным ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.7,
                    masks: ['**Н*']
                },
                '1': {
                    weight: 0.7,
                    masks: []
                },
                '2': {
                    weight: 0.7,
                    masks: ['!**Н*']
                }
            })
        }, {
            text: 'Судьба влияет на мою жизнь ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.1,
                    masks: ['!***В']
                },
                '1': {
                    weight: 0.1,
                    masks: ['**В*', '***В']
                },
                '2': {
                    weight: 0.1,
                    masks: ['!**В*']
                }
            })
        }, {
            text: 'Как только дело закончено, я теряю к нему интерес ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.75,
                    masks: ['БП**', 'Б*П*', 'Б**П', '*БП*', '*Б*П', '**БП']
                },
                '1': {
                    weight: 0.75,
                    masks: []
                },
                '2': {
                    weight: 0.75,
                    masks: ['ПБ**', 'П*Б*', 'П**Б', '*ПБ*', '*П*Б', '**ПБ']
                }
            })
        }, {
            text: 'Лучше потратить заработанные деньги на удовольствие сегодняшнего дня, чем отложить на черный день ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.4,
                    masks: ['Н***', '*Н**']
                },
                '1': {
                    weight: 0.4,
                    masks: ['БН**', 'Б*Н*', 'Б**Н', '*БН*', '*Б*Н', '**БН']
                },
                '2': {
                    weight: 0.4,
                    masks: ['БН**', 'Б*Н*', 'Б**Н', '*БН*', '*Б*Н', '**БН']
                }
            })
        }, {
            text: 'Если не сидеть на месте, то обязательно подвернется какая-нибудь интересная возможность ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: []
                },
                '1': {
                    weight: 0.5,
                    masks: ['ПВ**', 'ВП**']
                },
                '2': {
                    weight: 0.5,
                    masks: ['ПВ**', 'ВП**']
                }
            })
        }, {
            text: 'Пусть я не стану специалистом, но понемножку буду разбираться во всём ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.1,
                    masks: ['*П**']
                },
                '1': {
                    weight: 0.1,
                    masks: ['!*П**']
                },
                '2': {
                    weight: 0.1,
                    masks: ['!*П**']
                }
            })
        }, {
            text: 'Просьба рассказать о себе ставит меня в тупик ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.4,
                    masks: ['**П*', '***П']
                },
                '1': {
                    weight: 0.4,
                    masks: []
                },
                '2': {
                    weight: 0.4,
                    masks: ['П***', '*П**']
                }
            })
        }, {
            text: 'Упреки в невежестве очень обидны ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.8,
                    masks: ['В***', '**В*']
                },
                '1': {
                    weight: 0.8,
                    masks: []
                },
                '2': {
                    weight: 0.8,
                    masks: ['*В**', '***В']
                }
            })
        }, {
            text: 'Имея такую возможность, я бы несколько лет своей жизни посвятил путешествиям ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: []
                },
                '1': {
                    weight: 1.5,
                    masks: ['!*Б**']
                },
                '2': {
                    weight: 1.5,
                    masks: ['!*Б**']
                }
            })
        }, {
            text: 'Я умею смеяться над собой ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1.5,
                    masks: []
                },
                '1': {
                    weight: 1.5,
                    masks: ['!*В**']
                },
                '2': {
                    weight: 1.5,
                    masks: ['!*В**']
                }
            })
        }, {
            text: 'Когда мне нечем заняться, я чувствую себя опустошенным(ной)',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.3,
                    masks: ['**Н*']
                },
                '1': {
                    weight: 0.3,
                    masks: ['!**Н*']
                },
                '2': {
                    weight: 0.3,
                    masks: ['!**Н*']
                }
            })
        }, {
            text: 'Настоящий мир скрыт от посторонних глаз ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['!***В']
                },
                '1': {
                    weight: 0.5,
                    masks: ['!В***']
                },
                '2': {
                    weight: 0.5,
                    masks: ['!В***']
                }
            })
        }, {
            text: 'Знание будущего - проклятье а не дар ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 1,
                    masks: ['**Б*']
                },
                '1': {
                    weight: 1,
                    masks: []
                },
                '2': {
                    weight: 1,
                    masks: []
                }
            })
        }, {
            text: 'Я быстро забываю о неудаче и двигаюсь дальше ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.5,
                    masks: ['*П**', '***П']
                },
                '1': {
                    weight: 0.5,
                    masks: []
                },
                '2': {
                    weight: 0.5,
                    masks: ['П***', '**П*']
                }
            })
        }, {
            text: 'Мой дом - моя крепость ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.75,
                    masks: ['!***П']
                },
                '1': {
                    weight: 0.75,
                    masks: []
                },
                '2': {
                    weight: 0.75,
                    masks: ['!П***']
                }
            })
        }, {
            text: 'Часто перед тем как что-то начать делать я испытываю нервозность или даже страх ',
            answers: answers,
            onanswer: fn_answer({
                '0': {
                    weight: 0.833333333333333,
                    masks: ['!*Б**']
                },
                '1': {
                    weight: 0.833333333333333,
                    masks: []
                },
                '2': {
                    weight: 0.833333333333333,
                    masks: ['!**Б*']
                }
            })
        },
    ];


    function calculate_result() { // обработка результатов
        // считать тут особо нечего, все считается в процессе
    }

    function show_result() { // вывод результатов теста пользователю
        clearInterval(timerInterval); //останвливаем таймер для этого и нужна была outerInterval переменная
        var sorted_result = []; //пустой массив  sorted_result
        //В это массив впихиваем объект с весами и именем типа
        for (i = 0; i < typesWeights.length; i++) sorted_result.push({
            weight: typesWeights[i],
            name: typenames[i]
        });
        console.dir(sorted_result);

        //Если compareFunction(a, b) меньше 0, сортировка поставит a по меньшему индексу, чем b, то есть, a идёт первым.
        //Если compareFunction(a, b) вернёт 0, сортировка оставит a и b неизменными по отношению друг к другу, но отсортирует их по отношению
        //ко всем другим элементам. Обратите внимание: стандарт ECMAscript не гарантирует данное поведение, и ему следуют не все браузеры (например, версии Mozilla по крайней мере, до 2003 года).
        //Если compareFunction(a, b) больше 0, сортировка поставит b по меньшему индексу, чем a.
        sorted_result.sort(function(a, b) {
            return b.weight - a.weight
        });
        var html = '<h3>Результат теста</h3>';
        html += '<p><b>Предполагаемый тип: <span>' + sorted_result[0].name + '</span></b></p><div style="font-size: 80%">';
        html += '<p>Набранное количество баллов по типам: (чем больше значение, тем больше шансов, что тип окажется правильным):</p>';

        html += '<ul style="list-style: none">';
        for (i = 0; i < typesWeights.length; i++) {
            html += '<li>Тип ' + sorted_result[i].name + ' &mdash; ' + Math.round(sorted_result[i].weight * 100) / 100 + '</li>';
        }
        html += '</ul></div>';
        innerElement.innerHTML = html;
    }

    function value_encode(value) {
        var value1 = Math.floor(value / 50);
        var value2 = value % 50;
        return encryptNumber(value1) + encryptNumber(value2);
    }

    function value_decode(hash, position) {
        return decryptNumber(hash[position * 2 + 1]) * 50 + decryptNumber(hash[position * 2 + 2]);
    }

    function encode_hash() {
        var buffer = value_encode(questionsCounter);
        for (i = 0; i < typesWeights.length; i++) buffer += value_encode(typesWeights[i] * 30);
        return buffer;
    }

    function decodeHash() {
        var startarray = document.location.hash;
        var hash_len = document.location.hash.length - 1;
        if (hash_len == -1 || hash_len != (24 + 1) * 2) return false;
        questionsCounter = value_decode(startarray, 0);
        for (i = 0; i < 24; i++) typesWeights[i] = value_decode(startarray, i + 1) / 30;
        if (questionsCounter >= questions.length) {
            calculate_result();
            show_result();
            if (descriptionElement && descriptionElement.style) {
                descriptionElement.style.display = 'none'
            } // скрываем вводный текст, если указан элемент с ним
            return false;
        }
        return true;
    }

    function hash_change() {
        if (hash_flag) { // 
            if (decodeHash()) showQuestion(questions[questionsCounter]);
        }
    }

    /* ========= ЧАСТЬ, ОТВЕЧАЮЩАЯ ЗА ЗАПУСК ТЕСТА ================================== */

    try {
        // создаем элементы, используемые при выводе вопросов и результата
        var testForm = document.createElement('form');
        if (class_name) testForm.className = class_name; // задаем имя класса, это может быть нужно для специфических стилей для конкретного теста
        testForm.onsubmit = nextQuestion; // вешаем обработчик, который будет вызываться после того, как пользователь ответил на вопрос 
        var qfset = document.createElement('fieldset');
        qfset.style.padding = "10px"
        testForm.appendChild(qfset);
        var innerElement = document.createElement('div'); // в этот внутренний div будем выводить вопросы (чтобы можно было делать это через innerHTML, а не возиться с DOM)  
        qfset.appendChild(innerElement);
        var startButton = document.createElement('input'); // создаем кнопку, по нажатию на которую будет запускаться тест
        startButton.type = 'button';
        startButton.value = 'Начать тест';
        startButton.onclick = startTest;
        qfset.appendChild(startButton);
        testElement.appendChild(testForm);

        // вешаем обработчик изменения хеша
        if (window.addEventListener) window.addEventListener('hashchange', hash_change);
        else if (window.attachEvent) window.attachEvent('onhashchange', hash_change);
        else window.onhashchange = hash_change;

        if (decodeHash()) startTest(); // если уже задан хеш, то стартуем сразу, не ждем нажатия кнопки
    } catch (e) {
        alert(e.message);
    }

}(document.getElementById('test'), document.getElementById('description'), false);