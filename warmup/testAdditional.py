import unittest
import os
import testLib

class TestAddUndefinedUser(testLib.RestTestCase):
	def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
		expected = { 'errCode' : errCode }
		if count is not None:
			expected['count']  = count
		self.assertDictEqual(expected, respData)

	def testAddBadUser(self):
		#make sure I can add a user
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		#test Long username
		longUsername = "1234567890" * 13
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : longUsername, 'password' : 'thisIsNotAPassword'} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)
		longUsername = "1234567890" * 13
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : longUsername, 'password' : 'thisPasswordDoesntMatter'} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)
		#test empty Username
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : '', 'password' : 'thisIsNotAPassword'} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : '', 'password' : 'thisPasswordDoesntMatter'} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)
		#can i still log in?
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 3)
	
	def testAddLongPass(self):
		self.setUp()
		#make sure I can add a user
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		#test that long passwords fail
		longPassword = "1234567890" * 13
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : longPassword} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_PASSWORD)
		#make sure that you can create with valid password
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : "thisIsAValidPassword"} )
		self.assertResponse(respData, count = 1)
		#make sure you can login
		respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : "thisIsAValidPassword"} )
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : "thisIsAValidPassword"} )
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 3)
		#finally make sure that long passwords still fail
		respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'Tester2', 'password' : longPassword} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_PASSWORD)


	def testLoginUndef(self):
		self.setUp()
		#make sure I can add a user
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		#this is the check
		respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'thisIsNotAUser', 'password' : 'thisIsNotAPassword'} )
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
		#then make sure I can add it
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'thisIsNotAUser', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = 1)
		#and that I can login
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'thisIsNotAUser', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)

	def testLoggingInAndReset(self):
		#add some users
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 1)
		#now test logging in
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = 4)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 4)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = 5)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 5)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 6)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 7)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 8)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 9)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = 10)
		#reset
		self.makeRequest("/TESTAPI/resetFixture", method="POST")
		#check that you can't login
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Andy', 'password' : 'Chu'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester', 'password' : 'Test'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)

		

	def testLoginBadNamePassword(self):
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		#test login bad name
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'ThisIsNotAUser', 'password' : 'Test1'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
		#make sure I can login
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 3)
		#test login bad password
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
		#test login bad user and password
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'ThisIsNotAUser', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
		#add bad user
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'ThisIsNotAUser', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = 1)
		#login bad user
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'ThisIsNotAUser', 'password' : 'thisIsNotAPassword'})
		self.assertResponse(respData, count = 2)



	def testMultipleUsers(self):
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester2', 'password' : 'test2'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester2', 'password' : 'test2'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 4)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester3', 'password' : 'test3'})
		self.assertResponse(respData, count = 1)

	def testAddIfUserExists(self):
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 1)
		#same user and pass... should fail
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_USER_EXISTS)
		#same user, diff pass... should still fail
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'anotherPassword'})
		self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_USER_EXISTS)
		#add another user... to be sure
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester2', 'password' : 'test2'})
		self.assertResponse(respData, count = 1)
		#login tester1 and tester2
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'test1'})
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester2', 'password' : 'test2'})
		self.assertResponse(respData, count = 2)

	def testMultiplePasswords(self):
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester1', 'password' : 'password'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester2', 'password' : 'password'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester3', 'password' : 'password'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester4', 'password' : 'password'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/add", method="POST", data = {'user' : 'Tester5', 'password' : 'password'})
		self.assertResponse(respData, count = 1)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'password'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester2', 'password' : 'password'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester3', 'password' : 'password'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester4', 'password' : 'password'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester5', 'password' : 'password'})
		self.assertResponse(respData, count = 2)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'password'})
		self.assertResponse(respData, count = 3)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'password'})
		self.assertResponse(respData, count = 4)
		respData = self.makeRequest("/users/login", method="POST", data = {'user' : 'Tester1', 'password' : 'password'})
		self.assertResponse(respData, count = 5)