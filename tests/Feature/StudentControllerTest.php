<?php

namespace Tests\Feature;

use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;

use Tests\TestCase;

class StudentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $testStudent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
        $this->actingAs($this->user);

        $this->testStudent = User::factory()->yearGroup("7")->create();
    }

    public function testIndex(): void
    {
        $response = $this->get(route("admin.students"));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('AdminBoard/Students/Students') // Replace with the actual component name
                ->has('students');
        });
    }

    /**
     * Need to test showing of user that's also admin. (That one should fail)
     */
    public function testShow(): void
    {

        $response = $this->get(route("admin.students.show", ['id' => $this->testStudent->id]));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('AdminBoard/Students/Student')
                ->has('student')
                ->where('student.username', $this->testStudent->username)
                ->has('availableClubs')
                ->where('availableClubs', [])
                ->has('organizedByTerm');
        });
    }

    public function testShowOfAdmin(): void
    {

        $response = $this->get(route("admin.students.show", ['id' => $this->user->id]));

        // Assert redirect back to the 'previous-page'
        $response->assertRedirect(route("admin.students"));
    }

    public function testDeletionOfStudentActingAsAdmin(): void
    {
        $response = $this->delete(route("admin.students.delete", ['id' => $this->testStudent->id]));
        $response->assertRedirect(route("admin.students"));

        $this->assertDatabaseMissing('users', [
            'id' => $this->testStudent->id
        ]);

    }

    public function testDeletionOfNonExistentStudentActingAsAdmin(): void
    {
        $response = $this->delete(route("admin.students.delete", ['id' => 515]));
        
        $response->assertNotFound();

    }

    public function testDeletionOfAdminInStudentPageAsAdmin(): void
    {
        $response = $this->delete(route("admin.students.delete", ['id' => $this->user->id]));
        
        $response->assertRedirect();
        $response->assertSessionHasErrors('id');
    }

    public function testStudentAccessOfPagesIsDenied(): void
    {
        $this->actingAs($this->testStudent);

        $response = $this->get(route("admin.students"));
        $response->assertRedirect(route("dashboard"));
    }

    /**
     * Think this is obsolete.
     */
    public function testImportOfStudents(): void
    {
        
    }

    public function testStoreOfIndividualUser(): void
    {
        
    }
}
