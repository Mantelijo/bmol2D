// Credit: https://github.com/evanw/lightgl.js
// Provides a simple 3D vector class. Vector operations can be done using member
// functions, which return new vectors, or static functions, which reuse

import { Coord, Coordinate } from "./types/atoms";

// existing vectors to avoid generating garbage.
export class Vector {
	constructor(public x: number, public y: number, public z: number) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	negative() {
		return new Vector(-this.x, -this.y, -this.z);
	}
	add(v: Vector | number) {
		if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
		else return new Vector(this.x + v, this.y + v, this.z + v);
	}
	subtract(v: Vector | number) {
		if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
		else return new Vector(this.x - v, this.y - v, this.z - v);
	}
	multiply(v: Vector | number) {
		if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
		else return new Vector(this.x * v, this.y * v, this.z * v);
	}
	divide(v: Vector | number) {
		if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
		else return new Vector(this.x / v, this.y / v, this.z / v);
	}
	equals(v: Vector) {
		return this.x == v.x && this.y == v.y && this.z == v.z;
	}
	dot(v: Vector) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	cross(v: Vector) {
		return new Vector(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x,
		);
	}
	length() {
		return Math.sqrt(this.dot(this));
	}
	// Alias for length
	magnitude() {
		return this.length();
	}
	unit() {
		return this.divide(this.length());
	}
	min() {
		return Math.min(Math.min(this.x, this.y), this.z);
	}
	max() {
		return Math.max(Math.max(this.x, this.y), this.z);
	}
	toAngles() {
		return {
			theta: Math.atan2(this.z, this.x),
			phi: Math.asin(this.y / this.length()),
		};
	}
	angleTo(a: Vector) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	}
	toArray(n: number) {
		return [this.x, this.y, this.z].slice(0, n || 3);
	}
	toCoord(): Coordinate {
		return new Coord(this.x, this.y, this.z);
	}
	clone() {
		return new Vector(this.x, this.y, this.z);
	}
	init(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	normalize() {
		return this.unit();
	}

	// Index
	setIndex(i: number, val: number) {
		switch (i) {
			case 0:
				this.x = val;
				break;
			case 1:
				this.y = val;
				break;
			case 2:
				this.z = val;
				break;
		}
	}

	// Distance to given vector
	distanceTo(v: Vector): number {
		return Math.sqrt(
			Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2),
		);
	}

	static negative(a: Vector, b: Vector, c: Vector) {
		b.x = -a.x;
		b.y = -a.y;
		b.z = -a.z;
		return b;
	}
	static add(a: Vector, b: Vector, c: Vector) {
		if (b instanceof Vector) {
			c.x = a.x + b.x;
			c.y = a.y + b.y;
			c.z = a.z + b.z;
		} else {
			c.x = a.x + b;
			c.y = a.y + b;
			c.z = a.z + b;
		}
		return c;
	}
	static subtract(a: Vector, b: Vector, c: Vector) {
		if (b instanceof Vector) {
			c.x = a.x - b.x;
			c.y = a.y - b.y;
			c.z = a.z - b.z;
		} else {
			c.x = a.x - b;
			c.y = a.y - b;
			c.z = a.z - b;
		}
		return c;
	}
	static multiply(a: Vector, b: Vector, c: Vector) {
		if (b instanceof Vector) {
			c.x = a.x * b.x;
			c.y = a.y * b.y;
			c.z = a.z * b.z;
		} else {
			c.x = a.x * b;
			c.y = a.y * b;
			c.z = a.z * b;
		}
		return c;
	}
	static divide(a: Vector, b: Vector, c: Vector) {
		if (b instanceof Vector) {
			c.x = a.x / b.x;
			c.y = a.y / b.y;
			c.z = a.z / b.z;
		} else {
			c.x = a.x / b;
			c.y = a.y / b;
			c.z = a.z / b;
		}
		return c;
	}
	static cross(a: Vector, b: Vector, c: Vector) {
		c.x = a.y * b.z - a.z * b.y;
		c.y = a.z * b.x - a.x * b.z;
		c.z = a.x * b.y - a.y * b.x;
		return c;
	}
	static unit(a: Vector, b: Vector, c: Vector) {
		var length = a.length();
		b.x = a.x / length;
		b.y = a.y / length;
		b.z = a.z / length;
		return b;
	}
	static fromAngles(theta: number, phi: number): Vector {
		return new Vector(
			Math.cos(theta) * Math.cos(phi),
			Math.sin(phi),
			Math.sin(theta) * Math.cos(phi),
		);
	}
	static randomDirection() {
		return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
	}
	static min(a: Vector, b: Vector, c: Vector) {
		return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
	}
	static max(a: Vector, b: Vector, c: Vector) {
		return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
	}
	static lerp(a: Vector, b: Vector, fraction: number) {
		return b.subtract(a).multiply(fraction).add(a);
	}
	static fromArray(a: number[]) {
		return new Vector(a[0], a[1], a[2]);
	}
	static angleBetween(a: Vector, b: Vector, c: Vector) {
		return a.angleTo(b);
	}

	// Invalid value
	static infinity() {
		return new Vector(Infinity, Infinity, Infinity);
	}
}
