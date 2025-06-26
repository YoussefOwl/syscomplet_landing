<?php

namespace App\Models;
use PHPUnit\Exception;
use App\Models\users\actions_logs;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\{Crypt,DB,Response,Schema,Storage,File};

/* --------------------- To use a function in other class -------------------- */
// use App\Models\helpers;
// helpers::function_name(params)

class helpers
{
    /* ------------------------ Retourne une image base64 ----------------------- */
    
    public static function get_image($image, $source)
    {
        $fullPathAvatar = storage_path('app/private/' . $source . '/' . $image);
        $image = File::exists($fullPathAvatar)
        ? "data:image/png" . ";base64," . base64_encode(file_get_contents($fullPathAvatar))
        : null;
        return $image;
    }

    public static function get_id_logger()
    {
        try
        {
            $token = JWTAuth::getToken();
            $token_decoded = JWTAuth::getPayload($token)->toArray();
            if(isset($token_decoded['api_id_user']))
            {
                if($token_decoded['api_id_user'])
                {
                    return intval(Crypt::decryptString($token_decoded['api_id_user']));
                }
                else 
                {
                    return Response::json(
                    [
                    'api_message' => 'Access Denied invalid api_id_user'
                    ],403);
                    exit();
                }   
            }
            else
            {
                return Response::json(
                [
                    'api_message' => 'Access Denied invalid api_id_user'
                ],403);
                exit();
            }
        }
        catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException $ex) {
            return Response::json(['Api_Error_message' => 'Token is Expired helpers','Error' => $ex], 401);
        }
        catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException $ey) {
            return Response::json(['Api_Error_message' => 'Token is Invalid helpers','Error' => $ey], 401);
        }
        catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException $ez) {
            return Response::json(['Api_Error_message' => 'Token is not found helpers','Error' => $ez], 401);
        }
        catch (Exception $e) {
            return Response::json(['Api_Error_message' => 'Error helpers', 'Error' => $e], 401);
        }
    }

    public static function get_id_role_base_64_md5()
    {
       return md5(base64_encode(DB::table('users')->where('id',self::get_id_logger())->value('id_role')));
    }

    public static function if_user_is_admin()
    {
       return DB::table('users')->where('id',self::get_id_logger())->value('id_role') == intval(env('identifiant_role_admin'))
       ? true
       : false;
    }

    public static function GetLabels($value_de_comparaison,$liste,$la_cle_voulue="label")
    {
        $json_data = config('config_arrays');
        $label = null;

        foreach($json_data[$liste] as $key) 
        {
            if ($value_de_comparaison == $key['value']) 
            {
                $label = $key[$la_cle_voulue];
                break;
            }
        }
        return $label;
    }

    public static function Log_action($table_name,$id_user,$libelle,$description=null,$json_log_data=null)
    {
        if($table_name && $id_user && $libelle)
        {
            if(Schema::hasTable($table_name))
            {
                $query_log = actions_logs::create([
                    'id_user' => intval($id_user),
                    'table_name' => $table_name,
                    'libelle_log' => trim($libelle),
                    'json_log_data' => $json_log_data ? json_encode($json_log_data) : null,
                    'description' => $description ? trim($description) : null
                ]);
                $query_log->save();
            }
        }
    }
    
    public static function getRoleValue($key) {
        $apiRoles = config('config_can_access_api');
        foreach ($apiRoles as $role) {
            if ($role['key'] == $key) {
                return $role['value'];
            }
        }
        return null;
    }

    # Create a new array with a specific value of a chosen key from the original array of objects

    public static function map_list_single_key($source_list, $wanted_key)
    {
        $new_array = array_map(function($item) use ($wanted_key) 
        {
            if(gettype($item) == "object")
            {
                return isset($item->$wanted_key) ? $item->$wanted_key : null;
            }
            else if(gettype($item) == "array")
            {
                return isset($item[$wanted_key]) ? $item[$wanted_key] : null;
            }
        }, $source_list);
        
        return $new_array;
    }

    public static function moveFile($fileName,$content,$disk) {
        $etat = Storage::disk($disk)->put($fileName, $content);
        return $etat;
    }

    // Helper function to handle value assignment
    public static function handleValue($value, $type = 'string', $upper = false, $removeSpaces = false) {
        // Simplified check for null-like values
        if (in_array($value, [null, 'null', '', '0', 0], true)) {
            return in_array($type, ['double', 'bool', 'int']) ? 0 : null;
        }
        
        // to upper case
        if ($upper) $value = self::upper($value);

        // Handling based on type
        return match($type) {
            'double' => doubleval($value),
            'int' => intval($value),
            'datetime' => $value != " " ? date("Y-m-d H:i:s", strtotime($value)) : null,
            'time' => $value != " " ? date("H:i:s", strtotime($value)) : null,
            'date' => date("Y-m-d", strtotime($value)),
            'bool' => filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== false ? 1 : 0,
            default => $removeSpaces ? self::remove_spaces($value) : trim($value)
        };
    }

    public static function upper(string $string) {
        return $string ? mb_strtoupper($string, 'UTF-8') : null;
    }

    public static function remove_spaces($string)
    {
        return preg_replace('/\s+/','',$string);
    }

    public static function is_decimal($value) {
        if (is_numeric($value)) {
            return (float)$value != (int)$value;
        }
        return false;
    }

    public static function apiResponse($message, $Data = null, $erreur = null, $http_code=200)
    {
        $response = ['api_message' => $message];
        if ($erreur) {$response['erreur'] = $erreur; }
        if ($Data) {$response['Data'] = $Data; }
        return response()->json($response,$http_code);
    }
}