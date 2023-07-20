DATE := $(shell /bin/date)
CHANGE := $(shell tail -n 1 .git/COMMIT_EDITMSG)

build:	site/index.html
	mkdir -p _build
	cp -r site/* _build
	sed -e "s/_UPDATE_/$(DATE)<br>$(CHANGE)/" site/index.html > _build/index.html
