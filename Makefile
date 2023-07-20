DATE := $(shell /bin/date)
TITLE := $(shell head -n 1 .git/COMMIT_EDITMSG)
COMMENT := $(shell tail -n 1 .git/COMMIT_EDITMSG)

log: site/changelog.txt
	echo "~~o~~" >> site/changelog.txt
	echo "$(DATE):" >> site/changelog.txt
	echo "$(TITLE)" >> site/changelog.txt
	echo "($(COMMENT))" >> site/changelog.txt
	echo "" >> site/changelog.txt

build:	site/index.html
	mkdir -p _build
	cp -r site/* _build
	sed -e "s/_UPDATETIME_/$(DATE)/" site/index.html > _build/index.html
