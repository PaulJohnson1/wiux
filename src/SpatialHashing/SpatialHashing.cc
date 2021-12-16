#include "robin_hood.h"
#include <ctime>
#include <iostream>
#include <vector>
#include <algorithm>
#include <node.h>

using namespace robin_hood;

#define CELL_SIZE 7

class SpatialHash
{
public:
    unordered_flat_map<int32_t, std::vector<uint32_t>> cells;

    SpatialHash()
    {
    }

    void insert(int32_t x, int32_t y, int32_t w, int32_t h, uint32_t id)
    {
        int32_t const startX = (x - w) >> CELL_SIZE;
        int32_t const startY = (y - h) >> CELL_SIZE;
        int32_t const endX = (x + w) >> CELL_SIZE;
        int32_t const endY = (y + h) >> CELL_SIZE;

        for (int32_t x = startX; x <= endX; x++)
        {
            for (int32_t y = startY; y <= endY; y++)
            {
                int32_t key = x + y * 46340; // magic number is sqrt(int32_tmax)

                cells[key].push_back(id);
            }
        }
    }

    void query(int32_t x, int32_t y, int32_t w, int32_t h, std::vector<uint32_t> &out)
    {
        int32_t const startX = (x - w) >> CELL_SIZE;
        int32_t const startY = (y - h) >> CELL_SIZE;
        int32_t const endX = (x + w) >> CELL_SIZE;
        int32_t const endY = (y + h) >> CELL_SIZE;

        for (int32_t x = startX; x <= endX; x++)
        {
            for (int32_t y = startY; y <= endY; y++)
            {
                int32_t key = x + y * 46340; // magic number is sqrt(int32_tmax)

                std::vector<uint32_t> &cell = cells[key];

                for (size_t j = 0; j < cell.size(); j++)
                {
                    uint32_t id = cell.at(j);

                    if (std::find(out.begin(), out.end(), id) == out.end())
                        out.push_back(id);
                }
            }
        }
    }

    void clear()
    {
        cells.clear();
    }
};

using v8::ArrayBuffer;
using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::TypedArray;
using v8::Uint32Array;
using v8::Value;

SpatialHash spatialHash;

void insert(const FunctionCallbackInfo<Value> &rawArgs)
{
    spatialHash.insert((int32_t)(rawArgs[0].As<Number>()->Value()),
                       (int32_t)(rawArgs[1].As<Number>()->Value()),
                       (int32_t)(rawArgs[2].As<Number>()->Value()),
                       (int32_t)(rawArgs[3].As<Number>()->Value()),
                       (uint32_t)(rawArgs[4].As<Number>()->Value()));
}

void query(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    std::vector<uint32_t> result;
    spatialHash.query((int32_t)(rawArgs[0].As<Number>()->Value()),
                      (int32_t)(rawArgs[1].As<Number>()->Value()),
                      (int32_t)(rawArgs[2].As<Number>()->Value()),
                      (int32_t)(rawArgs[3].As<Number>()->Value()),
                      result);

    Local<ArrayBuffer> buf = ArrayBuffer::New(isolate, result.size() * 4);
    Local<Uint32Array> arr = Uint32Array::New(buf, 0, result.size());

    for (size_t i = 0; i < result.size(); i++)
    {
        arr->Set(context, i, Number::New(isolate, result.at(i)));
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
