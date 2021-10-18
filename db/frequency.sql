CREATE TABLE freqtest(
  freq_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  verb VARCHAR(100) NOT NULL UNIQUE COLLATE utf8_bin,
  FOREIGN KEY(verb) REFERENCES test(infinitive),
  freq_index DECIMAL
);