mkdir dist/content
cd content/
cp -r . ../dist/posts/
cd ../dist/content/

prefix="./"
suffix=".md"
for i in $(find . -name '*.md' -print)
do
  string=${i#$prefix}
  string=${string%$suffix}
  echo "$string"
  echo "$string" >> all
  mkdir $string
  mv $i $string/index.html
done
mkdir allposts
mv all allposts/index.html
cd ../../