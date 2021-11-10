#include "robin_hood.h"
#include <ctime>
#include <iostream>
#include <vector>
#include <algorithm>
#include <node.h>

typedef int32_t i32;

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
    unordered_flat_map<i32, std::vector<Box>> cells;
    i32 cellSize;

    SpatialHash(i32 cellSize)
    {
        this->cellSize = cellSize;
    }

    void getHashes(Box box, std::vector<i32> *out)
    {
        i32 const startX = (box.x - box.w) / cellSize;
        i32 const startY = (box.y - box.h) / cellSize;
        i32 const endX = (box.x + box.w) / cellSize;
        i32 const endY = (box.y + box.h) / cellSize;

        for (i32 x = startX; x <= endX; x++)
        {
            for (i32 y = startY; y <= endY; y++)
            {
                i32 key = x + y * 46340; // magic number is sqrt(i32max)

                out->push_back(key);
            }
        }
    }

    void insert(Box box)
    {
        std::vector<i32> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            cells[keys.at(i)].push_back(box);
        }
    }

    void query(Box box, std::vector<Box> *out)
    {
        std::vector<i32> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            i32 key = keys.at(i);

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

class Random
{
public:
    uint32_t seed;

    Random(uint32_t seed)
    {
        this->seed = seed;
    }

    double next()
    {
        seed = seed * 33619 % 2147483647;

        return (double)seed / 2147483647;
    }
};

int main()
{
  SpatialHash test(170);
  Random rand(1);

  for (uint32_t i = 0; i < 100'000; i++)
  {
    test.insert(Box{
      (int32_t)(rand.next() * 29000),
      (int32_t)(rand.next() * 29000),
      (int32_t)(rand.next() * 10),
      (int32_t)(rand.next() * 10),
      (uint16_t)(i),
    });
  }

  for (uint32_t i = 0; i < 100'000; i++)
  {
    std::vector<Box> asht;
    test.query(Box{
      (int32_t)(rand.next() * 29000),
      (int32_t)(rand.next() * 29000),
      (int32_t)(rand.next() * 10),
      (int32_t)(rand.next() * 10),
      (uint16_t)(i),
    }, &asht);
  }
}

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

SpatialHash spatialHash(20);

void setCellSize(const FunctionCallbackInfo<Value> &rawArgs)
{
    spatialHash.cellSize = (i32)(rawArgs[0].As<Number>()->Value());
}

void insert(const FunctionCallbackInfo<Value> &rawArgs)
{
    Box box = {
      (i32)(rawArgs[0].As<Number>()->Value()),
      (i32)(rawArgs[1].As<Number>()->Value()),
      (i32)(rawArgs[2].As<Number>()->Value()),
      (i32)(rawArgs[3].As<Number>()->Value()),
      (uint16_t)(rawArgs[4].As<Number>()->Value())};

    spatialHash.insert(box);
}

void query(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    Box box = {
      (i32)(rawArgs[0].As<Number>()->Value()),
      (i32)(rawArgs[1].As<Number>()->Value()),
      (i32)(rawArgs[2].As<Number>()->Value()),
      (i32)(rawArgs[3].As<Number>()->Value()),
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
    NODE_SET_METHOD(exports, "setCellSize", setCellSize);
    NODE_SET_METHOD(exports, "insert", insert);
    NODE_SET_METHOD(exports, "query", query);
    NODE_SET_METHOD(exports, "clear", clear);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init);
