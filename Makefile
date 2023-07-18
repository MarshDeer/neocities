DATE := $(shell /bin/date)
site:	index.html
	mkdir -p _build
	cp *.html *.css *.js *.png *.gif *.jpg _build/
	sed -e "s/_UPDATETIME_/$(DATE)/" _build/index.html > _build/index.html
