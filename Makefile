DATE := $(shell /bin/date)
site:	index.html
	mkdir -p _build
	sed -e "-/_UPDATETIME_/$(DATE)/" index.html > _build/index.html
