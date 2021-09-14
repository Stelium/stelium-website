$(document).ready(function(){
	$('header a.nav_trigger').on('click',function(e){
		e.preventDefault();
		$('body').toggleClass('mobile_nav_active');
	});

	$('body').on("mousemove",function(e) {
		var ax = ($(this).innerWidth()/2- e.pageX)/20;
		var ay = ($(this).innerHeight()/2- e.pageY)/80;

		if(ax<0 &&ax<-100){
			ax=-100;
		}else if(ax>0 && ax>100){
			ax=100;
		}

		if(ay<0 &&ay<-50){
			ay=-50;
		}else if(ay>0 && ay>50){
			ay=50;
		}
		$('section.model_list .planet_1').attr('style','transform: translate('+ax*2+'px,'+ay*2+'px);transition:none;');
		$('section.model_list .planet_2').attr('style','transform: translate('+ax+'px,'+ay+'px);transition:none;');
		$('section.model_list .planet_3').attr('style','transform: translate('+ax/2+'px,'+ay/2+'px);transition:none;');
	});
	
	$('.content_form form').each(function(){
		var $form = $(this),
			$submit=$form.find('button[type="submit"]').addClass('disabled');
		
		$form.find('.js_required, .js_email').on('input',function(){
			var $field=$(this);
				$field.wrapper = $field.closest('.col')
			
			if($field.val() == ''){
				$field.wrapper.removeClass('valid').addClass('invalid');
			}else{
				if($field.hasClass('js_email')){
					if(validateEmail($field.val())){
						$field.wrapper.removeClass('invalid').addClass('valid');
					} else {
						$field.wrapper.addClass('invalid').removeClass('valid');
					}
				} else {
					$field.wrapper.removeClass('invalid').addClass('valid');
				}
			}
			
			if($form.find('.js_required, .js_email').length == $form.find('.valid').length){
				$submit.removeClass('disabled');
			} else {
				$submit.addClass('disabled');
			}
		});
	});
	$('#contact_form').on('submit', function(event){
		event.preventDefault();
		
		var $t=$(this);
			$t.msg=$t.find('.js_message');
			$t.sbmt=$t.find('.js_submit');

		if($t.find('.js_required, .js_email').length != $t.find('.valid').length) return;
		
		$.ajax({
			type: $t.attr('method'),
			url: $t.attr('action'),
			data: $t.serialize(),
			dataType:'json',
			success: function(data){
				if(data.status=="success"){
					$t.msg.find('.message').removeClass('js_error');
					$t.find('input, textarea').val('');
				}
				if(data.status=="error"){
					$t.msg.find('.message').addClass('js_error');
				}
				$t.msg.find('.message').text(data.message);
				$t.sbmt.hide();
				$t.msg.show();
			}
		});
	});
	$('.careers_overview').each(function(){
		var $t=$(this);
			$t.n_all=$t.find('.list .item:eq(4)').nextAll().hide();
		if(!$t.n_all.length){
			$t.find('.button_p').hide()
		}
		$t.find('.button_p a').on('click',function(e){
			e.preventDefault();
			
			var st=$(document).scrollTop();
			
			$t.n_all.slideDown(300);
			
			$(document).scrollTop(st)
			$(this).closest('.button_p').fadeOut(300);
		});
	});
	
	AOS.init({
		once: true
	});
});
$(window).on('resize',function(){
	AOS.refreshHard();
});

$(window).on('load',function(){
	AOS.refreshHard();
});

function validateEmail(str) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	return reg.test(str);	
}	