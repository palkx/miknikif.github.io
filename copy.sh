mkdir dist/posts/
cd content/
cp -r . ../dist/posts/
cd ../dist/posts/

for i in *.md
do
  echo "$i"
  echo "${i%.md}" >> allposts
  mkdir ${i%.md}
  mv $i ${i%.md}/index.html
done
cd ../../