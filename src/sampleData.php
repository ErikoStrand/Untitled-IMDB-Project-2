<?php
  $filePath = "../data/ratings.csv";

  $fileContent = file_get_contents($filePath);

  header("Content-Type: text/csv");
  echo $fileContent;
?>