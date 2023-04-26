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
  },
  {
    path: 'respuesta-abierta',
    children: [
      {
        path: '',
        loadChildren: () => import('./views/evaluaciones/respuesta-abierta/respuesta-abierta.module').then( m => m.RespuestaAbiertaPageModule)
      },
      {
        path: ':module/:id/:evaluation',
        loadChildren: () => import('./views/evaluaciones/respuesta-abierta/respuesta-abierta.module').then( m => m.RespuestaAbiertaPageModule)
      }
    ]    
  },
  {
    path: 'opcion-multiple',
    children: [
      {
        path: '',
        loadChildren: () => import('./views/evaluaciones/opcion-multiple/opcion-multiple.module').then( m => m.OpcionMultiplePageModule)
      },
      {
        path: ':module/:id/:evaluation',
        loadChildren: () => import('./views/evaluaciones/opcion-multiple/opcion-multiple.module').then( m => m.OpcionMultiplePageModule)
      }
    ]     
  },
  {
    path: 'ordenamiento',
    children: [
      {
        path: '',
        loadChildren: () => import('./views/evaluaciones/ordenamiento/ordenamiento.module').then( m => m.OrdenamientoPageModule)
      },
      {
        path: ':module/:id/:evaluation',
        loadChildren: () => import('./views/evaluaciones/ordenamiento/ordenamiento.module').then( m => m.OrdenamientoPageModule)
      }
    ]    
  },
  {
    path: 'finalizada',
    loadChildren: () => import('./views/evaluaciones/finalizada/finalizada.module').then( m => m.FinalizadaPageModule)
  },
  {
    path: 'editor',
    loadChildren: () => import('./views/editor/editor.module').then( m => m.EditorPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
