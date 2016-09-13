const tmpl = contents =>
	contents.map(content => ` 
	<a href="/${content.room_id}" class="live-wrapper">
	    <div class="live-poster">
	        <div><img class="live-image" src="${content.room_src}"></div>
	        <div class="live-info">
	            <span class="dy-name">${content.nickname}</span>
	            <span class="popularity">22万</span>
	        </div>
	        <div class="live-title">${content.room_name}</div>
	    </div>    
	</a>
`).join('');

export default tmpl;
