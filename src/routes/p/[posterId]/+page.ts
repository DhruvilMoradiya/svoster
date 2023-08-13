import { doc, getDoc } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';

export const ssr = false;
export const load = (async ({ params }) => {
	const posterUrl = new URL('https://images.weserv.nl/');
	const posterRef = doc(db, 'posters', params.posterId);
	const postSnap = await getDoc(posterRef);
	if (postSnap.exists()) {
		posterUrl.searchParams.append('url', postSnap.data().posterUrl);
		return { ...postSnap.data(), posterUrl };
	} else {
		error(404, 'Not Found buddy :)');
	}
	// return {
	// 	userUid: 'wUuGQpB7W8cinsV6TALFPDRXzDg2',
	// 	supporters: 0,
	// 	height: 1080,
	// 	posterUrl:
	// 		'https://firebasestorage.googleapis.com/v0/b/svoster-9854a.appspot.com/o/posters%2FULwpjgzRGvClZHYXwhNr%2Fposter.png?alt=media&token=bf37b815-f985-4060-8f6d-4eed9dc27fea',
	// 	time: {
	// 		seconds: 1689680316,
	// 		nanoseconds: 744000000
	// 	},
	// 	posterName: 'dfsdfsdf',
	// 	username: 'Bgmi Lover',
	// 	posterDesc:
	// 		'Apart from adding styles inside style tags, you can also add styles to individual elements using the style attribute. Usually you will want to do styling through CSS, but this can come in handy for dynamic styles, especially when combined with CSS custom properties.',
	// 	userPfp:
	// 		'https://lh3.googleusercontent.com/a/AAcHTtcdu-NBOaRXr2RFDKhS2NLZDecnNFArkKQe9xm9EKhO=s96-c'
	// };
}) satisfies PageLoad;
