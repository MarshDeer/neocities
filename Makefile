DATE := $(shell /bin/date)
build:	site/index.html
	mkdir -p _build
	cp -r site/* _build
	sed -e "s/_UPDATETIME_/$(DATE)/" site/index.html > _build/index.html
