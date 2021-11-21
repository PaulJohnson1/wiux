#include "robin_hood.h"
#include <ctime>
#include <iostream>
#include <vector>
#include <algorithm>
#include <node.h>

using namespace robin_hood;

struct Box
{
    int32_t x;
    int32_t y;
    int32_t w;
    int32_t h;
    uint16_t id;
    bool operator==(const Box box)
    {
        return box.id == id;
    }
};

class SpatialHash
{
public:
    unordered_flat_map<int32_t, std::vector<Box>> cells;

    SpatialHash()
    {
    }

    void getHashes(Box box, std::vector<int32_t> *out)
    {
        int32_t const startX = (box.x - box.w) >> 6;
        int32_t const startY = (box.y - box.h) >> 6;
        int32_t const endX = (box.x + box.w) >> 6;
        int32_t const endY = (box.y + box.h) >> 6;

        for (int32_t x = startX; x <= endX; x++)
        {
            for (int32_t y = startY; y <= endY; y++)
            {
                int32_t key = x + y * 46340; // magic number is sqrt(int32_tmax)

                out->push_back(key);
            }
        }
    }

    void insert(Box box)
    {
        std::vector<int32_t> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            cells[keys.at(i)].push_back(box);
        }
    }

    void query(Box box, std::vector<Box> *out)
    {
        std::vector<int32_t> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            int32_t key = keys.at(i);

            std::vector<Box> cell = cells[key];
            int32_t length = cell.size();

            for (int32_t j = 0; j < length; j++)
            {
                Box box1 = cell.at(j);

                if (std::find(out->begin(), out->end(), box1) == out->end())
                    out->push_back(box1);
            }
        }
    }

    void clear()
    {
        cells.clear();
    }
};

using v8::Array;
using v8::ArrayBuffer;
using v8::Context;
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Int32Array;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::TypedArray;
using v8::Value;

SpatialHash spatialHash;

void insert(const FunctionCallbackInfo<Value> &rawArgs)
{
    Box box = {
      (int32_t)(rawArgs[0].As<Number>()->Value()),
      (int32_t)(rawArgs[1].As<Number>()->Value()),
      (int32_t)(rawArgs[2].As<Number>()->Value()),
      (int32_t)(rawArgs[3].As<Number>()->Value()),
      (uint16_t)(rawArgs[4].As<Number>()->Value())};

    spatialHash.insert(box);
}

void query(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    Box box = {
      (int32_t)(rawArgs[0].As<Number>()->Value()),
      (int32_t)(rawArgs[1].As<Number>()->Value()),
      (int32_t)(rawArgs[2].As<Number>()->Value()),
      (int32_t)(rawArgs[3].As<Number>()->Value()),
      (uint16_t)(rawArgs[4].As<Number>()->Value())};

    std::vector<Box> result;
    spatialHash.query(box, &result);

    Local<ArrayBuffer> buf = ArrayBuffer::New(isolate, result.size() * 4);
    Local<Int32Array> arr = Int32Array::New(buf, 0, result.size());

    int size = result.size();

    for (int i = 0; i < size; i++)
    {
        arr->Set(context, i, Number::New(isolate, result.at(i).id));
    }

    rawArgs.GetReturnValue().Set(arr);
}

void clear(const FunctionCallbackInfo<Value> &rawArgs)
{
    spatialHash.clear();
}

void Init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "insert", insert);
    NODE_SET_METHOD(exports, "query", query);
    NODE_SET_METHOD(exports, "clear", clear);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init);
