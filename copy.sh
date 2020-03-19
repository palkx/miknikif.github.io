mkdir dist/content/
cd content/
cp -r . ../dist/content/
cd ../dist/content/

rm all
for i in *.md
do
  echo "$i"
  echo "${i%.md}" >> all
  mkdir ${i%.md}
  mv $i ${i%.md}/index.html
done
mkdir allposts
mv all allposts/index.html
cd ../../