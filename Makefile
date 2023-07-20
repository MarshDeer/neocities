DATE := $(shell /bin/date)
TITLE := $(shell head -n 1 .git/COMMIT_EDITMSG)
COMMENT := $(shell tail -n 1 .git/COMMIT_EDITMSG)

log: site/changelog.txt
	echo "$(DATE):" >> changelog.txt
	echo "$(TITLE)" >> changelog.txt
	echo "($(COMMENT))" >> changelog.txt
	echo "n" >> changelog.txt

build:	site/index.html
	mkdir -p _build
	cp -r site/* _build
	sed -e "s/_UPDATETIME_/$(DATE)/" site/index.html > _build/index.html
