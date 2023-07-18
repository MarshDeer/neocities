DATE := $(shell /bin/date)
site:	index.html
	mkdir -p _build
	cp *.html *.css *.woff *.png _build/
	sed -e "s/_UPDATETIME_/$(DATE)/" index.html > _build/index.html
