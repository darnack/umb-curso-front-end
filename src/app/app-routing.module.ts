import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./views/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'lecciones',
    children: [
      {
        path: '',
        loadChildren: () => import('./views/lecciones/lecciones.module').then( m => m.LeccionesPageModule)
      },
      {
        path: ':module',
        loadChildren: () => import('./views/lecciones/lecciones.module').then( m => m.LeccionesPageModule)
      },
      {
        path: ':module/:id',
        loadChildren: () => import('./views/leccion-detalle/leccion-detalle.module').then( m => m.LeccionDetallePageModule)
      }
    ]
    
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
