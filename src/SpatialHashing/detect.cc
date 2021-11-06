// this took literally days to make. i might upload it on github so that other people dont have to waste days on making something similar to this

#include <iostream>
#include <vector>
#include <unordered_map>
#include <node.h>

struct Box
{
    int32_t x;
    int32_t y;
    int32_t w;
    int32_t h;
    uint16_t id;
};

class SpactialHash
{
public:
    int32_t cellSize;
    std::unordered_map<std::string, std::vector<Box>> cells;

    SpactialHash(int32_t cellSize)
    {
        this->cellSize = cellSize;
    }

    void getHashes(Box box, std::vector<std::string> *ptr)
    {
        int32_t startX = box.x / cellSize;
        int32_t startY = box.y / cellSize;
        int32_t endX = (box.x + box.w) / cellSize;
        int32_t endY = (box.y + box.h) / cellSize;

        for (int32_t x = startX; x <= endX; x++)
        {
            for (int32_t y = startY; y <= endY; y++)
            {
                std::string key = std::to_string(x) + ":" + std::to_string(y);

                (*ptr).push_back(key);
            }
        }
    }

    void insert(Box box)
    {
        std::vector<std::string> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            cells[keys.at(i)].push_back(box);
        }
    }

    void query(Box box, std::vector<Box> *ptr)
    {
        std::vector<std::string> keys;
        getHashes(box, &keys);

        int32_t keysLength = keys.size();

        for (int32_t i = 0; i < keysLength; i++)
        {
            std::string key = keys.at(i);

            std::vector<Box> cell = cells[key];
            int32_t length = cell.size();

            for (int32_t j = 0; j < length; j++)
            {
                (*ptr).push_back(cell.at(j));
            }
        }
    }

    void clear()
    {
        cells.clear();
    }
};

// this is where the shitty code starts

SpactialHash spatialHash(20);

using v8::Array;
using v8::TypedArray;
using v8::Int32Array;
using v8::ArrayBuffer;
using v8::Context;
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void setCellSize(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();

    int32_t args[1] = {
        (int32_t)rawArgs[0].As<Number>()->Value()};

    spatialHash.cellSize = args[0];
}

void insert(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();

    int32_t args[5] = {
        (int32_t)rawArgs[0].As<Number>()->Value(),
        (int32_t)rawArgs[1].As<Number>()->Value(),
        (int32_t)rawArgs[2].As<Number>()->Value(),
        (int32_t)rawArgs[3].As<Number>()->Value(),
        (int32_t)rawArgs[4].As<Number>()->Value()};

    Box box = {args[0], args[1], args[2], args[3], args[4]};

    spatialHash.insert(box);
}

void query(const FunctionCallbackInfo<Value> &rawArgs)
{
    Isolate *isolate = rawArgs.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    int32_t args[5] = {
        (int32_t)rawArgs[0].As<Number>()->Value(),
        (int32_t)rawArgs[1].As<Number>()->Value(),
        (int32_t)rawArgs[2].As<Number>()->Value(),
        (int32_t)rawArgs[3].As<Number>()->Value(),
        (int32_t)rawArgs[4].As<Number>()->Value()};

    Box box = {args[0], args[1], args[2], args[3], args[4]};

    std::vector<Box> result;
    spatialHash.query(box, &result);

    Local<ArrayBuffer> buf = ArrayBuffer::New(isolate, result.size() * 5 * 4);
    Local<Int32Array> arr = Int32Array::New(buf, 0, result.size() * 5);

    int size = result.size() * 5;

    for (int i = 0; i < size; i += 5)
    {
        Box box = result.at(i / 5);

        Local<Number> num = Number::New(isolate, box.x);
        arr->Set(context, i, num);

        num = Number::New(isolate, box.y);
        arr->Set(context, i + 1, num);

        num = Number::New(isolate, box.w);
        arr->Set(context, i + 2, num);

        num = Number::New(isolate, box.h);
        arr->Set(context, i + 3, num);

        num = Number::New(isolate, box.id);
        arr->Set(context, i + 4, num);
    }

    rawArgs.GetReturnValue().Set(arr);
}

void clear(const FunctionCallbackInfo<Value> &rawArgs) {
    spatialHash.clear();
}

void Init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "setCellSize", setCellSize);
    NODE_SET_METHOD(exports, "insert", insert);
    NODE_SET_METHOD(exports, "query", query);
    NODE_SET_METHOD(exports, "clear",  clear);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init);
