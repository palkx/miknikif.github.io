mkdir dist/posts/
cp -r content/ dist/posts/
cd dist/posts/
rm all
for i in *.md
do
  echo "${i%.md}" >> all
  mkdir ${i%.md}
  mv $i ${i%.md}/index.md
done
cd ../../