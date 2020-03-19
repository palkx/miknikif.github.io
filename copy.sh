mkdir dist/content/
cd dist/content/

rm all
prefix="../../content/"
suffix=".md"
for i in $(ls -ct $prefix*$suffix)
do
  string=${i#$prefix}
  string=${string%$suffix}
  echo "$string"
  echo "$string" >> all
  mkdir $string
  cp $i $string/index.html
done
mkdir allposts
mv all allposts/index.html
cd ../../