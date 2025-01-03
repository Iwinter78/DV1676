
INSERT INTO city (city_name, city_gps) 
VALUES 
('Karlskrona', '56.1612,15.5869'),
('Stockholm', '59.3293,18.0686'),
('Malmö', '55.604981,13.003822');

SET @Karlskrona_id = (SELECT id FROM city WHERE city_name = 'Karlskrona');
SET @Stockholm_id = (SELECT id FROM city WHERE city_name = 'Stockholm');
SET @Malmo_id = (SELECT id FROM city WHERE city_name = 'Malmö');


INSERT INTO bike (gps, city)
VALUES
('9F8Q5H6P+FQ', @Karlskrona_id),
('9F8Q5H6P+JP', @Karlskrona_id),
('9F8Q5H6P+Q9', @Karlskrona_id),
('9F8Q5H6P+QH', @Karlskrona_id),
('9F7JHXWX+4W', @Malmo_id),
('9F7MH2V2+VX', @Malmo_id),
('9F7MH2V4+3X', @Malmo_id),
('9F7MH2Q4+2V', @Malmo_id),
('9FFW83FC+58', @Stockholm_id),
('9FFW83FC+V4', @Stockholm_id),
('9FFW83FF+GP', @Stockholm_id),
('9FFW83H8+HQ', @Stockholm_id);


INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES 
(0, @Karlskrona_id, 10, '[
    [56.162176519644504, 15.586952569742806],
    [56.16212933069397, 15.586952569742806],
    [56.16212933069397, 15.587559898243313],
    [56.162176519644504, 15.587559898243313],
    [56.162176519644504, 15.586952569742806]
]'),
(0, @Karlskrona_id, 10, '[
    [56.16346379886474, 15.58657449282066],
    [56.16317586060731, 15.58657449282066],
    [56.16317586060731, 15.586744450395031],
    [56.16346379886474, 15.586744450395031],
    [56.16346379886474, 15.58657449282066]
]'),
(0, @Karlskrona_id, 10, '[
  [56.16151307488036, 15.585832820617014],
  [56.16130023369507, 15.585832820617014],
  [56.16130023369507, 15.586041847161056],
  [56.16151307488036, 15.586041847161056],
  [56.16151307488036, 15.585832820617014]
]
'),
(0, @Karlskrona_id, 10, '[
  [56.16569676027362, 15.58593716530035],
  [56.1656322945623, 15.58593716530035],
  [56.1656322945623, 15.586290019511665],
  [56.16569676027362, 15.586290019511665],
  [56.16569676027362, 15.58593716530035]
]'),
(0, @Karlskrona_id, 10, '[
  [56.16212942255183, 15.583518393356144],
  [56.16205693309624, 15.583407458369294],
  [56.16204117450104, 15.583445946018031],
  [56.16211492467178, 15.583573860849583],
  [56.16212933202917, 15.583518364338772]
]'),
(0, @Stockholm_id, 10, '[
  [59.330476420045244, 18.066840940869696],
  [59.33050085331061, 18.066960691750353],
  [59.33009057573443, 18.067371836440856],
  [59.33005799764996, 18.06727204404035],
  [59.3304764130267, 18.0668410770877]
]'),
(0, @Stockholm_id, 10, '[
  [59.33035284872457, 18.068847640834235],
  [59.33046832447289, 18.06950528825473],
  [59.33042964014081, 18.069542641723558],
  [59.33028818213387, 18.0688906539186],
  [59.330352977856705, 18.068847927563894]
]'),
(0, @Stockholm_id, 10, '[
  [59.32741307565186, 18.070354108891536],
  [59.32708769867057, 18.069285158736335],
  [59.32703045610151, 18.069373745765688],
  [59.327351314519746, 18.070401355307695],
  [59.3274123842873, 18.0703547356037]
]'),
(0, @Stockholm_id, 10, '[
  [59.32548191747597, 18.069954747393297],
  [59.32551078519151, 18.070117249585195],
  [59.325439232689575, 18.070155940583362],
  [59.32542097444079, 18.070043736688547],
  [59.32548173977253, 18.069954149148828]
]'),
(0, @Stockholm_id, 10, '[
  [59.32387692076426, 18.07260948040988],
  [59.32391963024526, 18.072902478854303],
  [59.32367998190617, 18.07289875823929],
  [59.32387692076426, 18.072606689949055]
]'),(0, @Malmo_id, 10, '[
  [55.59452995470568, 13.00061193387657],
  [55.59405134835734, 13.000636898590585],
  [55.594061424340595, 13.000997103754827],
  [55.59453398505042, 13.000829483529657],
  [55.59452999979973, 13.000610571477523]
]'),
(0, @Malmo_id, 10, '[
  [55.592133200359285, 12.998183521870033],
  [55.59184375056097, 12.998246808461374],
  [55.591835927563665, 12.997770181318856],
  [55.59220025406202, 12.997716783256976],
  [55.592136553047, 12.998185499575925]
]'),
(0, @Malmo_id, 10, '[
  [55.587476819855, 12.992311921661639],
  [55.58773589122313, 12.991067050573577],
  [55.587636065760876, 12.990999760244762],
  [55.587393631438374, 12.992316127306992],
  [55.587476797877514, 12.992311224523661]
]'),
(0, @Malmo_id, 10, '[
  [55.60537622280796, 13.00715838864241],
  [55.605350708731805, 13.007208360056524],
  [55.60512053843917, 13.006828769508587],
  [55.605140081252415, 13.006774954139644],
  [55.605376435453024, 13.007158339131877]
]'),
(0, @Malmo_id, 10, '[
  [55.60600416552026, 12.99979824543587],
  [55.6064657148159, 12.999763476117806],
  [55.606462441435525, 12.99959397569026],
  [55.605982888293966, 12.999607014184704],
  [55.6060040068387, 12.999798150681329]
]');


