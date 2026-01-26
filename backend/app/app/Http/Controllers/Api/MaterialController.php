<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaterialUploadRequest;
use App\Models\Material;
use Illuminate\Http\JsonResponse;

class MaterialController extends Controller
{
    public function upload(MaterialUploadRequest $request): JsonResponse
    {
        $data = $request->validated();

        $path = $request->file('file')->store('materials', 'public');

        $material = Material::create([
            'user_id' => $data['user_id'],
            'subject_id' => $data['subject_id'],
            'type' => $data['type'],
            'file_path' => $path,
            'validations_count' => 0,
        ]);

        return response()->json([
            'message' => 'Material enviado com sucesso.',
            'material' => $material,
        ], 201);
    }
}
