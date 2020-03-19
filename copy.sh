mkdir dist/posts/
cd content/
cp -r . ../dist/posts/
cd ../dist/posts/

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