export class User {
	public messagesKey: Array<any>
	constructor(
		public name: string,
		public email: string,
		public lat: number,
		public lng: number,
		public timestamp: any
	){}
}
