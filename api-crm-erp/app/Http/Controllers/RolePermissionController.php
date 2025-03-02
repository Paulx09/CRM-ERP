<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $roles = Role::with(["permissions"])->where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);
    
        return response()->json([
            "total" => $roles->total(),
            "roles" => $roles->map(function($rol) {
                $rol->permission_pluck = $rol->permissions->pluck("name");
                $rol->created_format_at = $rol->created_at->format("Y-m-d h:i A");
                return $rol;
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $IS_ROLE = Role::where("name",$request->name)->first();
        if($IS_ROLE){
            return response()->json([
                "message" => 403,
                "message_text" => "EL ROL YA EXISTE"
            ]);
        }
        $role = Role::create([
            'guard_name' => 'api',
            'name' => $request->name
        ]);

        foreach ($request->permisions as $key => $permision) {
            $role->givePermissionTo($permision);
        }

        return response()->json([
            "message" => 200,
            "role" => [
                "id" => $role->id,
                "permission" => $role->permissions,
                "permission_pluck" => $role->permissions->pluck("name"),
                "created_format_at" => $role->created_at->format("Y-m-d h:i A"),
                "name" => $role->name,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $IS_ROLE = Role::where("name",$request->name)->where("id","<>",$id)->first();
        if($IS_ROLE){
            return response()->json([
                "message" => 403,
                "message_text" => "EL ROL YA EXISTE"
            ]);
        }
        $role = Role::findOrFail($id);
        $role->update($request->all());
        $role->syncPermissions($request->permisions);

        return response()->json([
            "message" => 200,
            "role" => [
                "id" => $role->id,
                "permission" => $role->permissions,
                "permission_pluck" => $role->permissions->pluck("name"),
                "created_format_at" => $role->created_at->format("Y-m-d h:i A"),
                "name" => $role->name,
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json([
            "message" => 200,
        ]);
    }
}
