<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorStoreRequest;
use App\Http\Requests\VendorUpdateRequest;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vendor::with('user:id,name,email')->orderBy('created_at', 'desc');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $vendors = $query->paginate(15);

        return response()->json($vendors);
    }

    public function store(VendorStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        if ($request->hasFile('logo')) {
            $data['logo_url'] = $request->file('logo')->store('vendors', 'public');
        }

        $vendor = Vendor::create($data);

        // Update user role to vendor
        auth()->user()->update(['role' => 'vendor']);

        return response()->json([
            'message' => 'Cadastro de vendedor enviado com sucesso. Aguarde aprovação.',
            'vendor' => $vendor->load('user'),
        ], 201);
    }

    public function show(Vendor $vendor): JsonResponse
    {
        return response()->json([
            'vendor' => $vendor->load('user'),
        ]);
    }

    public function update(VendorUpdateRequest $request, Vendor $vendor): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo_url'] = $request->file('logo')->store('vendors', 'public');
        }

        $vendor->update($data);

        return response()->json([
            'message' => 'Informações do vendedor atualizadas com sucesso.',
            'vendor' => $vendor->load('user'),
        ]);
    }

    public function destroy(Vendor $vendor): JsonResponse
    {
        $vendor->delete();

        return response()->json([
            'message' => 'Vendedor excluído com sucesso.',
        ]);
    }

    public function myVendor(): JsonResponse
    {
        $vendor = Vendor::where('user_id', auth()->id())->with('user')->first();

        if (!$vendor) {
            return response()->json([
                'message' => 'Você não possui um cadastro de vendedor.',
            ], 404);
        }

        return response()->json([
            'vendor' => $vendor,
        ]);
    }
}
