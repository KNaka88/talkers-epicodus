import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from "./welcome/welcome.component";
import { UserComponent } from "./user/user.component";

const appRoutes: Routes = [
	{
		path: "",
		component: WelcomeComponent
	},
	{
		path: "user/:id",
		component: UserComponent
	}

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
