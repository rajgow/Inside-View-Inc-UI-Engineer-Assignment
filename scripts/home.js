
	var home = {
		model:{
			webResource : "http://newsmartwave.net/html/venedor/green/",
			crawledHistory : {},
			yqlQueryModel : [{
				url : 'https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20data.html.cssselect%20WHERE%20url%3D%27http%3A%2F%2Fnewsmartwave.net%2Fhtml%2Fvenedor%2Fgreen%2Findex.html%27%20AND%20css%3D%27%23products-tabs-content%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
				type : 'productList',
				data : ''
			},
			{
				url : "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20data.html.cssselect%20WHERE%20url%3D'http%3A%2F%2Fnewsmartwave.net%2Fhtml%2Fvenedor%2Fgreen%2Findex.html'%20AND%20css%3D'a'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				type : 'links',
				data : ''
			}],
			init : function() {
				
			}
		},
		controller: {
			
			
			doAjax : function(yqlQueryModel,index) {
				if(index < yqlQueryModel.length) {
					$.ajax({
						url:yqlQueryModel[index].url,
						crossDomain: true,
						dataType: 'jsonp',
						success:function(result) {
							yqlQueryModel[index].data = result.query.results.results;
							home.controller.doAjax(home.model.yqlQueryModel,index+1);
							home.controller.processTopopulateCrawlingResults(yqlQueryModel[index]);
						}
					});
				} else {
					$("#loader").removeClass('loader');
					$("#loaderBG").removeClass('loaderBG');
				}
			},
			processTopopulateCrawlingResults : function(yqlQueryModel) {
				switch(yqlQueryModel.type) {
					case "productList" :
						home.view.populateProductDetails(yqlQueryModel.data);
						break;
					case  "links" :
						home.view.populateWebLinks(yqlQueryModel.data);
						break;
				}
			},
			getEle : function( eleTag, className ) {
				return className ? $(document.createElement(eleTag)).addClass(className) : $(document.createElement(eleTag));
			},
			init:function(){
				home.model.init();
				home.view.init();
				home.controller.doAjax(home.model.yqlQueryModel,0);
			},
			destroy:function(){}
			 
		},
		view: { 
			
			populateProductDetails : function(data) {
				var $itemHover,$itemAnchor;
				$.each(data.div.div,function( index, pcategory ) {
					$.each(pcategory.div,function( index, pList ) {
						$itemHover = home.controller.getEle( "DIV", pList.div['class'] );
						$itemAnchor = home.controller.getEle( "A" ).attr('href',home.model.webResource+'/'+pList.div.div[0].a.href);
						$itemAnchor.append(home.controller.getEle( "IMG", pList.div.div[0].a.img[0]['class'] ).attr('src' , home.model.webResource+'/'+pList.div.div[0].a.img[0].src));
						$itemAnchor.append(home.controller.getEle( "IMG", pList.div.div[0].a.img[1]['class'] ).attr('src' , home.model.webResource+'/'+pList.div.div[0].a.img[1].src));
						$itemHover.append(home.controller.getEle( "DIV", pList.div.div[0]['class'] ).append(home.controller.getEle( "FIGURE", 'item-image-container' ).append($itemAnchor)));
						$itemHover.append(home.controller.getEle( "DIV", 'item-meta-container' ).append(home.controller.getEle( "H3", 'item-name' ).text(pList.div.div[1].h3.a.content)));
						$("#productsList").append(home.controller.getEle( "DIV", pList['class'] ).append($itemHover));
					});
				});
				$("#productList").removeClass('hide');
			},
			populateWebLinks : function(data) {
				var $webPageAtag;
				$.each(data.a,function( index, webPageLink) {
					if("content" in webPageLink && !home.model.crawledHistory[webPageLink.href]) {
						home.model.crawledHistory[webPageLink.href] = webPageLink;
						$webPageAtag = home.controller.getEle( "A" ,'fSize-1').attr('href',home.model.webResource+'/'+webPageLink.href);
						$webPageAtag.text(webPageLink.content);
						$("#linksContainer").append(home.controller.getEle( "DIV", 'col-md-3 col-sm-6 col-xs-12' ).append($webPageAtag));
					}
				});
				$("#webPageLink").removeClass('hide');
			},
			init:function() {
				
			},
			destroy:function(){}
		},
		init : function() {
			home.controller.init();
		}
	};
	home.init();