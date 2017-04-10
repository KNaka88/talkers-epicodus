export class User {
	constructor(
		public name: string,
		public email: string,
		public lat: number,
		public lng: number,
		public timestamp: string,
		public messagesKey: []
	){}
}
