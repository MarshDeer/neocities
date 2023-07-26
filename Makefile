DATE := $(shell /bin/date)

build:	site/index.html
	mkdir -p _build
	cp -r site/* _build
	sed -e "s/_UPDATE_/$(DATE)/" site/index.html > _build/index.html
